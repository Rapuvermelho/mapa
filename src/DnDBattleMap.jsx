import React, { useState } from 'react';
import {Trash2, Heart, Swords, Users, Box } from 'lucide-react';

const DnDBattleMap = () => {
  const [gridSize] = useState({ rows: 20, cols: 20 });
  const [entities, setEntities] = useState([]);
  const [objects, setObjects] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [showBgModal, setShowBgModal] = useState(false);
  const [modalType, setModalType] = useState('player');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [hpChange, setHpChange] = useState('');
  const [newEntity, setNewEntity] = useState({
    name: '',
    hp: 0,
    maxHp: 0,
    initiative: 0,
    type: 'player',
    hideHp: false,
    row: 0,
    col: 0,
    color: '#4299e1'
  });
  const [newObject, setNewObject] = useState({
    name: '',
    row: 0,
    col: 0,
    color: '#805ad5'
  });

  const colors = ['#4299e1', '#48bb78', '#ed8936', '#e53e3e', '#9f7aea', '#38b2ac', '#ed64a6'];

  const addEntity = () => {
    if (newEntity.name.trim() && newEntity.maxHp > 0) {
      setEntities([...entities, { ...newEntity, id: Date.now() }]);
      setNewEntity({
        name: '',
        hp: 0,
        maxHp: 0,
        initiative: 0,
        type: modalType,
        hideHp: false,
        row: 0,
        col: 0,
        color: colors[entities.length % colors.length]
      });
      setShowAddModal(false);
    }
  };

  const addObject = () => {
    if (newObject.name.trim()) {
      setObjects([...objects, { ...newObject, id: Date.now() }]);
      setNewObject({
        name: '',
        row: 0,
        col: 0,
        color: '#805ad5'
      });
      setShowObjectModal(false);
    }
  };

  const moveEntity = (id, row, col) => {
    setEntities(entities.map(e => e.id === id ? { ...e, row, col } : e));
  };

  const moveObject = (id, row, col) => {
    setObjects(objects.map(o => o.id === id ? { ...o, row, col } : o));
  };

  const updateHp = (id, change) => {
    setEntities(entities.map(e => {
      if (e.id === id) {
        const newHp = Math.max(0, Math.min(e.maxHp, e.hp + change));
        return { ...e, hp: newHp };
      }
      return e;
    }));
  };

  const deleteEntity = (id) => {
    setEntities(entities.filter(e => e.id !== id));
    if (selectedEntity === id) setSelectedEntity(null);
  };

  const deleteObject = (id) => {
    setObjects(objects.filter(o => o.id !== id));
    if (selectedObject === id) setSelectedObject(null);
  };

  const toggleHpVisibility = (id) => {
    setEntities(entities.map(e => e.id === id ? { ...e, hideHp: !e.hideHp } : e));
  };

  const sortedByInitiative = [...entities].sort((a, b) => b.initiative - a.initiative);

  const getEntityAt = (row, col) => entities.find(e => e.row === row && e.col === col);
  const getObjectAt = (row, col) => objects.find(o => o.row === row && o.col === col);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-2 md:p-4 flex flex-col md:flex-row gap-2 md:gap-4">
      {/* Left Panel - Initiative & Controls */}
      <div className="w-full md:w-80 flex flex-col gap-2 md:gap-4 max-h-96 md:max-h-full overflow-y-auto">
        {/* Initiative Tracker */}
        <div className="bg-gray-800 rounded-lg p-3 md:p-4">
          <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 flex items-center gap-2">
            <Swords size={18} className="md:w-5 md:h-5" />
            Initiative Order
          </h2>
          <div className="space-y-2">
            {sortedByInitiative.map((entity, idx) => (
              <div
                key={entity.id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedEntity === entity.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => {
                  setSelectedEntity(entity.id);
                  setSelectedObject(null);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm md:text-base">#{idx + 1} {entity.name}</span>
                  <span className="text-xs md:text-sm bg-gray-900 px-2 py-1 rounded">{entity.initiative}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Heart size={14} className="text-red-400" />
                  {entity.type === 'monster' && entity.hideHp ? (
                    <span className="text-xs md:text-sm text-gray-400">Hidden</span>
                  ) : (
                    <span className="text-xs md:text-sm">{entity.hp}/{entity.maxHp}</span>
                  )}
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
                    entity.type === 'player' ? 'bg-blue-900' : 'bg-red-900'
                  }`}>
                    {entity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => { setModalType('player'); setShowAddModal(true); }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 md:px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <Users size={16} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add Player</span>
            <span className="sm:hidden">Player</span>
          </button>
          <button
            onClick={() => { setModalType('monster'); setShowAddModal(true); }}
            className="flex-1 bg-red-600 hover:bg-red-700 px-3 md:px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <Swords size={16} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add Monster</span>
            <span className="sm:hidden">Monster</span>
          </button>
        </div>
        <button
          onClick={() => setShowObjectModal(true)}
          className="bg-purple-600 hover:bg-purple-700 px-3 md:px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Box size={16} className="md:w-5 md:h-5" />
          Add Object
        </button>
        <button
          onClick={() => setShowBgModal(true)}
          className="bg-gray-600 hover:bg-gray-700 px-3 md:px-4 py-2 rounded font-semibold text-sm md:text-base"
        >
          🖼️ Set Background
        </button>

        {/* Selected Entity Controls */}
        {selectedEntity && entities.find(e => e.id === selectedEntity) && (
          <div className="bg-gray-800 rounded-lg p-3 md:p-4">
            <h3 className="font-bold mb-3 text-sm md:text-base">
              {entities.find(e => e.id === selectedEntity)?.name}
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={hpChange}
                  onChange={(e) => setHpChange(e.target.value)}
                  placeholder="0"
                  className="flex-1 px-2 py-2 bg-gray-700 rounded text-sm md:text-base"
                />
                <span className="text-xs md:text-sm text-gray-400">HP</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const value = parseInt(hpChange) || 0;
                    if (value !== 0) {
                      updateHp(selectedEntity, -Math.abs(value));
                      setHpChange('');
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-2 md:px-3 py-2 rounded text-sm md:text-base"
                >
                  Damage
                </button>
                <button
                  onClick={() => {
                    const value = parseInt(hpChange) || 0;
                    if (value !== 0) {
                      updateHp(selectedEntity, Math.abs(value));
                      setHpChange('');
                    }
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-2 md:px-3 py-2 rounded text-sm md:text-base"
                >
                  Heal
                </button>
              </div>
              {entities.find(e => e.id === selectedEntity)?.type === 'monster' && (
                <button
                  onClick={() => toggleHpVisibility(selectedEntity)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 px-2 md:px-3 py-2 rounded text-sm md:text-base"
                >
                  {entities.find(e => e.id === selectedEntity)?.hideHp ? 'Show HP' : 'Hide HP'}
                </button>
              )}
              <button
                onClick={() => deleteEntity(selectedEntity)}
                className="w-full bg-red-700 hover:bg-red-800 px-2 md:px-3 py-2 rounded flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Trash2 size={14} className="md:w-4 md:h-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Selected Object Controls */}
        {selectedObject && objects.find(o => o.id === selectedObject) && (
          <div className="bg-gray-800 rounded-lg p-3 md:p-4">
            <h3 className="font-bold mb-3 text-sm md:text-base">
              {objects.find(o => o.id === selectedObject)?.name}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  deleteObject(selectedObject);
                  setSelectedObject(null);
                }}
                className="w-full bg-red-700 hover:bg-red-800 px-2 md:px-3 py-2 rounded flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Trash2 size={14} className="md:w-4 md:h-4" />
                Delete Object
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-auto bg-gray-800 rounded-lg p-2 md:p-4">
        <div 
          className="inline-block min-w-full bg-cover bg-center bg-no-repeat"
          style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
        >
          {Array.from({ length: gridSize.rows }).map((_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: gridSize.cols }).map((_, col) => {
                const entity = getEntityAt(row, col);
                const obj = getObjectAt(row, col);
                const cellSize = typeof window !== 'undefined' && window.innerWidth < 768 
                  ? Math.floor((window.innerWidth - 32) / gridSize.cols) 
                  : 40;
                return (
                  <div
                    key={`${row}-${col}`}
                    style={{ 
                      width: `${cellSize}px`, 
                      height: `${cellSize}px`,
                      minWidth: `${cellSize}px`,
                      minHeight: `${cellSize}px`
                    }}
                    className={`border border-gray-600 cursor-pointer hover:bg-gray-700 hover:bg-opacity-30 transition-colors ${
                      selectedEntity && entity?.id === selectedEntity ? 'ring-2 ring-yellow-400' : ''
                    } ${
                      selectedObject && obj?.id === selectedObject ? 'ring-2 ring-purple-400' : ''
                    }`}
                    onClick={() => {
                      if (selectedEntity && !entity && !obj) {
                        moveEntity(selectedEntity, row, col);
                      } else if (selectedObject && !entity && !obj) {
                        moveObject(selectedObject, row, col);
                      }
                    }}
                  >
                    {entity && (
                      <div
                        className="w-full h-full flex items-center justify-center font-bold"
                        style={{ 
                          backgroundColor: entity.color,
                          fontSize: `${Math.max(8, cellSize * 0.3)}px`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntity(entity.id);
                          setSelectedObject(null);
                        }}
                      >
                        {entity.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    {obj && !entity && (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: obj.color, opacity: 0.7 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedObject(obj.id);
                          setSelectedEntity(null);
                        }}
                      >
                        <Box size={Math.max(12, cellSize * 0.4)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Add Entity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Add {modalType === 'player' ? 'Player' : 'Monster'}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newEntity.name}
                onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded text-sm md:text-base"
              />
              <div className="flex gap-2 items-center">
                <Heart size={18} className="text-red-400 flex-shrink-0" />
                <input
                  type="number"
                  placeholder="0"
                  value={newEntity.maxHp === 0 ? '' : newEntity.maxHp}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setNewEntity({ ...newEntity, maxHp: val, hp: val });
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm md:text-base"
                />
                <span className="text-xs text-gray-400">Max HP</span>
              </div>
              <div className="flex gap-2 items-center">
                <Swords size={18} className="text-blue-400 flex-shrink-0" />
                <input
                  type="number"
                  placeholder="0"
                  value={newEntity.initiative === 0 ? '' : newEntity.initiative}
                  onChange={(e) => setNewEntity({ ...newEntity, initiative: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm md:text-base"
                />
                <span className="text-xs text-gray-400">Initiative</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addEntity}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm md:text-base"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Object Modal */}
      {showObjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md">
            <h2 className="text-lg md:text-xl font-bold mb-4">Add Object</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Object name (e.g., Tree, Rock)"
                value={newObject.name}
                onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded text-sm md:text-base"
              />
              <div className="flex gap-2">
                <button
                  onClick={addObject}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm md:text-base"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowObjectModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Image Modal */}
      {showBgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md">
            <h2 className="text-lg md:text-xl font-bold mb-4">Set Background Image</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Image URL"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded text-sm md:text-base"
              />
              <p className="text-xs text-gray-400">Paste an image URL to use as the grid background</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBgModal(false)}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm md:text-base"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setBackgroundImage('');
                    setShowBgModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm md:text-base"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DnDBattleMap;