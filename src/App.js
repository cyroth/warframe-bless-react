import React, { useState, useEffect } from 'react';
import './App.css';

const BLESS_TYPES = [
  { id: 'affinity', name: 'Affinity' },
  { id: 'credit', name: 'Credit' },
  { id: 'resource', name: 'Resource' },
  { id: 'damage', name: 'Damage' },
  { id: 'health', name: 'Health' },
  { id: 'shield', name: 'Shield' },
];

function App() {
  const [theme, setTheme] = useState('dark');
  const [formData, setFormData] = useState({
    region: 'as',
    relay_name: 'larunda',
    relay_instance: '1',
    affinity_bless: '',
    credit_bless: '',
    resource_bless: '',
    damage_bless: '',
    health_bless: '',
    shield_bless: '',
    backup_bless: ''
  });
  const [output, setOutput] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme === 'dark' ? 'dark' : '';
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme === 'dark' ? 'dark' : '';
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateOutput = (e) => {
    e.preventDefault();
    
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    const wait_minutes = Math.floor((nextHour - now) / 60000);

    const outputLines = [];
     // eslint-disable-next-line
    const activeBlesses = [
      formData.affinity_bless, formData.credit_bless, formData.resource_bless,
      formData.damage_bless, formData.health_bless, formData.shield_bless, formData.backup_bless
    ].filter(Boolean);

    // Bot Command
    let blessCommand = `!bless ${formData.region} ${formData.relay_name} ${formData.relay_instance} ${wait_minutes} min `;
    const activeBlessTypes = BLESS_TYPES.filter((_, i) => formData[`${BLESS_TYPES[i].id}_bless`]).map(b => b.id);
    blessCommand += activeBlessTypes.join(' ');
    outputLines.push({ label: 'Bot Command', content: blessCommand });

    // Squad Message
    let rolesMessage = "BLESSING ROLES: ";
    if (formData.affinity_bless) rolesMessage += `@${formData.affinity_bless} -> ${BLESS_TYPES[0].name} | `;
    if (formData.credit_bless) rolesMessage += `@${formData.credit_bless} -> ${BLESS_TYPES[1].name} | `;
    if (formData.resource_bless) rolesMessage += `@${formData.resource_bless} -> ${BLESS_TYPES[2].name} | `;
    if (formData.damage_bless) rolesMessage += `@${formData.damage_bless} -> ${BLESS_TYPES[3].name} | `;
    if (formData.health_bless) rolesMessage += `@${formData.health_bless} -> ${BLESS_TYPES[4].name} | `;
    if (formData.shield_bless) rolesMessage += `@${formData.shield_bless} -> ${BLESS_TYPES[5].name} | `;
    if (formData.backup_bless) rolesMessage += `@${formData.backup_bless} -> Backup | `;
    rolesMessage += `Blessing in ${wait_minutes} minutes`;
    outputLines.push({ label: 'Squad Message', content: rolesMessage });

    // Whispers
    const regionMap = {"as": "Asia", "eu": "Europe", "na": "NorthAmerica"};
    const regionFull = regionMap[formData.region] || "Unknown";
    const nagMessage = `Reminder for bless at ${formData.relay_name.charAt(0).toUpperCase() + formData.relay_name.slice(1)} ${formData.relay_instance} in ${regionFull} region. You'll be on`;
    
    const blesserData = [
      formData.affinity_bless, formData.credit_bless, formData.resource_bless,
      formData.damage_bless, formData.health_bless, formData.shield_bless
    ];
    
    blesserData.forEach((blesser, i) => {
      if (blesser) {
        outputLines.push({ 
          label: `Whisper ${blesser}`, 
          content: `/w ${blesser} ${nagMessage} ${BLESS_TYPES[i].name}` 
        });
      }
    });

    // Roll call and thanks
    const rollCall = [
      formData.affinity_bless, formData.credit_bless, formData.resource_bless,
      formData.damage_bless, formData.health_bless, formData.shield_bless
    ].filter(Boolean);
    
    if (rollCall.length > 0) {
      outputLines.push({ label: 'Roll Call', content: 'Roll call. @' + rollCall.join(' @') + ' :clem:' });
      outputLines.push({ label: 'Thank You', content: 'Thanks to ' + rollCall.join(', ') + ' for blessing' });
    }

    setOutput(outputLines);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div>
          <h1 className="display-4 mb-0">Warframe Bless Helper</h1>
          <p className="lead mb-0">Generate blessing messages for Warframe relays.</p>
        </div>
        <div className="ms-3">
          <button 
            className="btn btn-outline-secondary" 
            onClick={toggleTheme}
            title="Toggle color theme"
          >
            🌙 <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
      
      <form onSubmit={generateOutput} className="mt-4">
        <div className="card">
          <div className="card-header">
            Blessing Setup
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="region" className="form-label">Region</label>
                <select 
                  className="form-select" 
                  name="region" 
                  value={formData.region}
                  onChange={handleInputChange}
                >
                  <option value="as">Asia</option>
                  <option value="eu">Europe</option>
                  <option value="na">North America</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="relay_name" className="form-label">Relay Name</label>
                <select 
                  className="form-select" 
                  name="relay_name"
                  value={formData.relay_name}
                  onChange={handleInputChange}
                >
                  <option value="larunda">Larunda</option>
                  <option value="strata">Strata</option>
                  <option value="kronia">Kronia</option>
                  <option value="maroo">Maroo</option>
                  <option value="orcus">Orcus</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="relay_instance" className="form-label">Relay Instance</label>
                <select 
                  className="form-select" 
                  name="relay_instance"
                  value={formData.relay_instance}
                  onChange={handleInputChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="69">69</option>
                </select>
              </div>
            </div>
            
            <div className="row">
              {BLESS_TYPES.map((bless, index) => (
                <div key={bless.id} className="col-md-6 mb-3">
                  <label htmlFor={`${bless.id}_bless`} className="form-label">{bless.name} Bless</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name={`${bless.id}_bless`}
                    value={formData[`${bless.id}_bless`]}
                    onChange={handleInputChange}
                    placeholder="Tenno"
                    autoComplete="off"
                  />
                </div>
              ))}
              <div className="col-md-6 mb-3">
                <label htmlFor="backup_bless" className="form-label">Backup Bless</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="backup_bless"
                  value={formData.backup_bless}
                  onChange={handleInputChange}
                  placeholder="Tenno"
                  autoComplete="off"
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">Generate Messages</button>
          </div>
        </div>
      </form>

      {output.length > 0 && (
        <div className="output-section">
          <div className="card">
            <div className="card-body">
              {output.map((item, index) => (
                <div key={index} className="output-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{item.label}:</strong>
                    <button 
                      className="btn btn-sm btn-outline-secondary copy-btn"
                      onClick={() => copyToClipboard(item.content, index)}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? '✓' : '📋'}
                    </button>
                  </div>
                  <div className="text-break p-2 rounded" style={{backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)'}}>{item.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;