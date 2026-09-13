"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { useGpsLocation } from '@/lib/useGpsLocation';

export default function ReportWizard() {
  const [selectedCategory, setSelectedCategory] = useState('Pothole');
  const [description, setDescription] = useState('Pothole is approximately 8 inches deep in the eastbound bicycle lane right before the crosswalk. Cars are swerving into oncoming traffic to avoid it during morning commute.');
  const [isUrgent, setIsUrgent] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState({
    detected: true,
    correlationPct: 88,
    count: 2,
    radius: 150,
    reportId: "#DPW-8412"
  });

  const router = useRouter();
  const { addIssue, updateIssue, addNotification } = useAppContext();
  const { coords, address: gpsAddress, status: gpsStatus, errorMsg, requestLocation } = useGpsLocation();

  const categories = [
    { id: 'Pothole', icon: '🛣️', desc: 'Road surface cavity' },
    { id: 'Streetlight', icon: '💡', desc: 'Outage or flicker' },
    { id: 'Garbage', icon: '🗑️', desc: 'Overflow or illegal dump' },
    { id: 'Water Leak', icon: '💧', desc: 'Hydrant or main pipe' },
    { id: 'Road Barrier', icon: '🚧', desc: 'Damaged guardrail' },
    { id: 'Traffic Signal', icon: '🚦', desc: 'Dead light or timing issue' },
    { id: 'Tree Hazard', icon: '🌳', desc: 'Fallen branch or root' },
    { id: 'Other Hazard', icon: '⚠️', desc: 'General inquiry' }
  ];

  // Auto request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Trigger real-time backend duplicate check when category or coordinates change
  useEffect(() => {
    async function checkDuplicates() {
      try {
        const res = await fetch('/api/ai/duplicate-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, latitude: coords.latitude, longitude: coords.longitude })
        });
        const data = await res.json();
        if (data.success) {
          setDuplicateInfo({
            detected: data.duplicateDetected,
            correlationPct: data.correlationPct || 88,
            count: data.similarCount || 2,
            radius: data.radiusMeters || 150,
            reportId: data.existingReportId || "#DPW-8412"
          });
        }
      } catch (err) {
        console.warn('Duplicate check API fallback:', err);
      }
    }
    checkDuplicates();
  }, [selectedCategory, coords.latitude, coords.longitude]);

  const handleFileSelect = (e, angleName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    setPhotos(prev => [...prev, { file, url: previewUrl, label: `${angleName} • ${sizeMb}` }]);
    if (!selectedFile) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newId = `CIV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const catObj = categories.find(c => c.id === selectedCategory);
    const defaultPlaceholder = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80";
    let initialPhoto = photos[0]?.url || defaultPlaceholder;

    const newIssue = {
      id: newId,
      type: selectedCategory.toUpperCase(),
      typeIcon: catObj ? catObj.icon : '⚠️',
      title: `${selectedCategory} Report`,
      description,
      location: gpsAddress || "742 Evergreen Terrace, Ward 4",
      latitude: coords.latitude,
      longitude: coords.longitude,
      gpsAccuracy: coords.accuracy,
      priorityScore: isUrgent ? 8.5 : 7.5,
      status: isUrgent ? "Flagged Urgent" : "Submitted",
      impact: isUrgent ? "Critical Hazard" : "Pending Review",
      confirmations: 0,
      time: "Just now",
      update: "Awaiting Triage Inspection",
      updateIcon: "⏱️",
      image: initialPhoto,
      photoBefore: initialPhoto,
      photoAfter: null,
      resolvedAt: null,
      verification: null,
      imageBadge: "Photo",
      badgeColor: "rgba(0,0,0,0.6)",
      department: "Public Works",
      assignedUnit: "Unassigned",
      targetSLA: isUrgent ? "Within 4 Hours" : "Within 24 Hours",
      jurisdiction: "Ward 4",
      isUrgent,
      history: [
        { status: isUrgent ? "Flagged Urgent" : "Submitted", time: new Date().toLocaleString(), detail: description, icon: "✓", active: true }
      ],
      reportedBy: "citizen",
      date: new Date().toLocaleString()
    };

    try {
      await addIssue(newIssue);

      // If citizen selected an actual file, upload it to /api/upload with type 'before'
      const fileToUpload = photos.find(p => p.file)?.file || selectedFile;
      if (fileToUpload) {
        const formData = new FormData();
        formData.append('photo', fileToUpload);
        formData.append('issueId', newId);
        formData.append('type', 'before');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.path) {
          updateIssue(newId, {
            image: uploadData.path,
            photoBefore: uploadData.path
          });
        }
      }

      addNotification(`Your report ${newId} has been submitted successfully with active GPS coordinates.`, newId);
      router.push(`/issue/${newId}`);
    } catch (err) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '2rem 0', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--panel-blue-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Municipal Report Dispatch</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--text-primary)' }}>Submit Infrastructure Report</h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600 }}>
              Reference Draft: <span style={{ color: 'var(--panel-blue)' }}>#DPW-1MP-8804</span>
            </div>
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--panel-blue-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>1</div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--panel-blue-dark)', fontWeight: 700 }}>Active Step</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Evidence & Details</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>2</div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Next</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Location & Pin</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>3</div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Final</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Submit & Track</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          
          {/* Alert */}
          {duplicateInfo.detected && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🔀</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, color: '#92400e' }}>Automatic Duplicate Detection Triggered</h4>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{duplicateInfo.correlationPct}% Correlation</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
                  {duplicateInfo.count} similar {selectedCategory.toLowerCase()} reports were registered within <strong>{duplicateInfo.radius} meters</strong> in the last 48 hours. Submitting will bundle your photo evidence and automatically elevate the civic prioritization score!
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  <a href="#" style={{ color: 'var(--panel-blue)' }}>👁 View existing report {duplicateInfo.reportId}</a>
                  <span style={{ color: '#059669' }}>↗ SLA Acceleration Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Photo Evidence */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--panel-blue)' }}>📸</span> Photo & Damage Evidence
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>High-resolution, street-level photography speeds up crew mobilization.</p>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--panel-blue)', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                {photos.length} of 3 Photos Added
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {photos.map((p, idx) => (
                <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', height: '160px' }}>
                  <img src={p.url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '0.5rem', color: 'white', fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.label}</span>
                    <span onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} style={{ color: '#ef4444', cursor: 'pointer' }}>🗑️</span>
                  </div>
                </div>
              ))}

              {photos.length === 0 && (
                <label style={{ border: '2px dashed var(--panel-blue)', borderRadius: '8px', background: '#eff6ff', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--panel-blue)', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'Primary Angle')} />
                  <span style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>📷</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Upload Incident Photo</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Primary Damage View</span>
                </label>
              )}

              {photos.length >= 1 && photos.length < 2 && (
                <label style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--panel-blue)', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'Add Context Angle')} />
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>+</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Add Context Angle</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Side profile or wide shot</span>
                </label>
              )}

              {photos.length >= 1 && photos.length < 3 && (
                <label style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', background: '#f8fafc', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'Optional Close-up')} />
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>+</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Optional Close-up</span>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Measurement or landmark</span>
                </label>
              )}
            </div>
            <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💡</span> Tip: Placing a coin, foot, or common object next to damage helps engineers calculate asphalt repair tonnage accurately.
            </div>
          </section>

          {/* Category */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--panel-blue)' }}>🗂️</span> Select Incident Category
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assigned municipal crew is determined by category selection.</p>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>REQUIRED</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {categories.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCategory(c.id)}
                  style={{ 
                    border: `1px solid ${selectedCategory === c.id ? 'var(--panel-blue-dark)' : 'var(--border-color)'}`, 
                    background: selectedCategory === c.id ? 'var(--panel-blue-dark)' : 'white',
                    color: selectedCategory === c.id ? 'white' : 'var(--text-primary)',
                    borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' 
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{c.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{c.id}</div>
                  <div style={{ fontSize: '0.75rem', opacity: selectedCategory === c.id ? 0.8 : 0.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Map & Active GPS Geolocation */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--panel-blue)' }}>📍</span> Auto-Detected Geolocation
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location synced from device GPS telemetry and photo metadata.</p>
              </div>
              <button 
                onClick={requestLocation} 
                style={{ color: 'var(--panel-blue)', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '0.35rem 0.75rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                ⟳ Recalibrate GPS
              </button>
            </div>
            
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📍</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{gpsAddress}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span>GPS: {coords.latitude.toFixed(4)}° N, {coords.longitude.toFixed(4)}° W</span>
                      <span>•</span>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '0.15rem 0.55rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>
                        GPS Accurate to {coords.accuracy}m
                      </span>
                    </div>
                  </div>
                </div>

                {gpsStatus !== 'granted' && (
                  <button 
                    onClick={requestLocation}
                    style={{ background: '#0f3b7a', color: 'white', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    📍 Allow Location Access
                  </button>
                )}

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border-color)', borderRadius: '4px', background: 'white' }}>Street</button>
                  <button style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border-color)', borderRadius: '4px', background: '#f1f5f9', color: 'var(--text-secondary)' }}>Satellite</button>
                </div>
              </div>

              <div style={{ height: '200px', background: '#e2e8f0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Mock Map Image with Live GPS Pin */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  🖐 Drag pin to adjust exact incident location ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: 'var(--panel-blue-dark)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Active GPS Lock ({coords.accuracy}m)
                  </div>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', border: '4px solid var(--panel-blue-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>📍</div>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section style={{ marginBottom: '2.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--panel-blue)' }}>📝</span> Description & Observations
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Describe dimensions, vehicular hazard level, lane blockage, or impact to cyclists and pedestrians.</p>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{description.length} / 500</div>
            </div>
            <textarea 
              style={{ width: '100%', height: '100px', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-primary)', resize: 'none', outline: 'none', background: '#f8fafc' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quick Details:</span>
              {['+ Deep cavity', '+ Blocking bike lane', '+ School bus route', '+ Sharp asphalt edges'].map(tag => (
                <span key={tag} onClick={() => setDescription(prev => `${prev} ${tag}`)} style={{ background: '#eff6ff', color: 'var(--panel-blue)', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>{tag}</span>
              ))}
            </div>
          </section>

          {/* Urgent Checkbox */}
          <section style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'flex', gap: '1rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: '#dc2626' }} />
              <div>
                <div style={{ color: '#b91c1c', fontWeight: 600, marginBottom: '0.25rem' }}>⚠ Immediate Safety & Pedestrian Transit Hazard</div>
                <div style={{ fontSize: '0.85rem', color: '#991b1b', opacity: 0.9 }}>Check this box if the defect poses an imminent threat to school buses, active pedestrian crosswalks, or two-wheel transit safety. Triggers priority triage in DPW field queue.</div>
              </div>
            </label>
          </section>
          
          {/* Target Dept */}
          <section style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '1.5rem' }}>🏢</span>
               <div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Target Department</div>
                 <div style={{ fontSize: '0.85rem' }}>Dispatched automatically to <strong style={{ color: 'var(--panel-blue-dark)' }}>Dept. of Public Works (Ward 4 Maintenance)</strong></div>
               </div>
             </div>
             <div style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
               <span>⏱</span> Target Response: &lt; 24h
             </div>
          </section>

          {/* Submit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handleSubmit} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}>
              Submit Report to City Operations <span>→</span>
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>🔒 Report public record • Anonymized citizen credentials</span>
              <a href="#" style={{ color: 'var(--panel-blue)', fontWeight: 600 }}>Save as Draft</a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
