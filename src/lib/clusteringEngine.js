// Haversine formula distance calculation in meters
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Geospatial Clustering Engine (1km / 1000m radius)
 * Groups issues within 1km of each other, calculates elevated priority scores
 * based on report density, and estimates completion time.
 */
export function computeClusters(issues = [], radiusMeters = 1000) {
  if (!issues || issues.length === 0) {
    return { clusters: [], stats: { totalClusters: 0, hotspotCount: 0, avgEstHours: 0, avgEstTimeStr: '0h 0m' } };
  }

  const visited = new Set();
  const clusters = [];

  for (let i = 0; i < issues.length; i++) {
    const current = issues[i];
    if (visited.has(current.id)) continue;

    const currentLat = current.latitude || 19.0760;
    const currentLon = current.longitude || 72.8777;

    const clusterMembers = [current];
    visited.add(current.id);

    // Find all other issues within 1km radius
    for (let j = i + 1; j < issues.length; j++) {
      const target = issues[j];
      if (visited.has(target.id)) continue;

      const targetLat = target.latitude || 19.0760;
      const targetLon = target.longitude || 72.8777;

      const dist = calculateDistance(currentLat, currentLon, targetLat, targetLon);
      if (dist <= radiusMeters) {
        clusterMembers.push({ ...target, distanceMeters: Math.round(dist) });
        visited.add(target.id);
      }
    }

    // Determine primary category and highest base score
    let maxBaseScore = Math.max(...clusterMembers.map(m => m.priorityScore || 7.0));
    const count = clusterMembers.length;

    // Priority Boosting based on density within 1km
    const densityBonus = (count - 1) * 0.5;
    const elevatedPriority = Math.min(10.0, Math.max(1.0, parseFloat((maxBaseScore + densityBonus).toFixed(1))));

    // Calculate Estimated Time to Solve based on Category & Priority
    const primaryCategory = clusterMembers[0].type || 'POTHOLE';
    let baseHours = 4.0;
    if (primaryCategory.includes('WATER')) baseHours = 2.0;
    else if (primaryCategory.includes('SIGNAL') || primaryCategory.includes('TREE')) baseHours = 3.0;
    else if (primaryCategory.includes('STREETLIGHT')) baseHours = 12.0;
    else if (primaryCategory.includes('GARBAGE')) baseHours = 6.0;

    // High density clusters receive accelerated crew dispatch (-25% time)
    if (count >= 3) baseHours = baseHours * 0.75;
    if (elevatedPriority >= 9.0) baseHours = Math.max(1.0, baseHours * 0.6);

    const hours = Math.floor(baseHours);
    const mins = Math.round((baseHours - hours) * 60);
    const calculatedEstTime = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins} mins`;

    // Check if admin manually saved a custom SLA time to any issue in this cluster
    const savedManualTime = clusterMembers.find(m => m.targetSLA || m.estTimeToSolve)?.targetSLA || 
                             clusterMembers.find(m => m.targetSLA || m.estTimeToSolve)?.estTimeToSolve;

    const estTimeToSolveStr = savedManualTime || calculatedEstTime;
    const hasManualOverride = Boolean(savedManualTime);

    // Extract zone location name
    const mainLoc = clusterMembers[0].location || 'Mumbai Central';
    const zoneName = `${mainLoc.split(',')[0]} Cluster Zone`;

    // Completely unique, deterministic cluster ID based on root issue ID
    const cleanId = (current.id || `idx_${i}`).toString().replace(/[^a-zA-Z0-9]/g, '');

    clusters.push({
      clusterId: `CLS-1KM-${cleanId}`,
      zoneName,
      centerLat: currentLat,
      centerLon: currentLon,
      count,
      elevatedPriority,
      densityBonus: parseFloat(densityBonus.toFixed(1)),
      estHours: parseFloat(baseHours.toFixed(1)),
      estTimeToSolve: estTimeToSolveStr,
      hasManualOverride,
      primaryCategory,
      primaryImage: clusterMembers[0].image,
      isHotspot: count >= 3,
      members: clusterMembers
    });
  }

  // Sort clusters by elevated priority descending
  clusters.sort((a, b) => b.elevatedPriority - a.elevatedPriority);

  const hotspotCount = clusters.filter(c => c.isHotspot).length;
  const avgEstHours = clusters.length > 0 
    ? parseFloat((clusters.reduce((acc, c) => acc + c.estHours, 0) / clusters.length).toFixed(1))
    : 0;

  return {
    clusters,
    stats: {
      totalClusters: clusters.length,
      hotspotCount,
      avgEstHours,
      avgEstTimeStr: `${Math.floor(avgEstHours)}h ${Math.round((avgEstHours % 1) * 60)}m`
    }
  };
}
