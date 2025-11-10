import React, { useState } from 'react';
import {Trash2, Heart, Swords, Users, Box } from 'lucide-react';

const DnDBattleMap = () => {
  const [gridSize] = useState({ rows: 20, cols: 20 });
  const [entities, setEntities] = useState([]);
  const [objects, setObjects] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [modalType, setModalType] = useState('player');
  const [newEntity, setNewEntity] = useState({
    name: '',
    hp: 20,
    maxHp: 20,
    initiative: 10,
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
    if (newEntity.name.trim()) {
      setEntities([...entities, { ...newEntity, id: Date.now() }]);
      setNewEntity({
        name: '',
        hp: 20,
        maxHp: 20,
        initiative: 10,
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
  };

  const toggleHpVisibility = (id) => {
    setEntities(entities.map(e => e.id === id ? { ...e, hideHp: !e.hideHp } : e));
  };

  const sortedByInitiative = [...entities].sort((a, b) => b.initiative - a.initiative);

  const getEntityAt = (row, col) => entities.find(e => e.row === row && e.col === col);
  const getObjectAt = (row, col) => objects.find(o => o.row === row && o.col === col);

  return (
    <div className="w-full h-screen bg-gray-900 text-white p-4 flex gap-4">
      {/* Left Panel - Initiative & Controls */}
      <div className="w-80 flex flex-col gap-4 overflow-y-auto">
        {/* Initiative Tracker */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Swords size={20} />
            Initiative Order
          </h2>
          <div className="space-y-2">
            {sortedByInitiative.map((entity, idx) => (
              <div
                key={entity.id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedEntity === entity.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedEntity(entity.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">#{idx + 1} {entity.name}</span>
                  <span className="text-sm bg-gray-900 px-2 py-1 rounded">{entity.initiative}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Heart size={14} className="text-red-400" />
                  {entity.type === 'monster' && entity.hideHp ? (
                    <span className="text-sm text-gray-400">Hidden</span>
                  ) : (
                    <span className="text-sm">{entity.hp}/{entity.maxHp}</span>
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold flex items-center justify-center gap-2"
          >
            <Users size={18} />
            Add Player
          </button>
          <button
            onClick={() => { setModalType('monster'); setShowAddModal(true); }}
            className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold flex items-center justify-center gap-2"
          >
            <Swords size={18} />
            Add Monster
          </button>
        </div>
        <button
          onClick={() => setShowObjectModal(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold flex items-center justify-center gap-2"
        >
          <Box size={18} />
          Add Object
        </button>

        {/* Selected Entity Controls */}
        {selectedEntity && entities.find(e => e.id === selectedEntity) && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-3">
              {entities.find(e => e.id === selectedEntity)?.name}
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => updateHp(selectedEntity, -5)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                  -5 HP
                </button>
                <button
                  onClick={() => updateHp(selectedEntity, -1)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                  -1 HP
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateHp(selectedEntity, 1)}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded"
                >
                  +1 HP
                </button>
                <button
                  onClick={() => updateHp(selectedEntity, 5)}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded"
                >
                  +5 HP
                </button>
              </div>
              {entities.find(e => e.id === selectedEntity)?.type === 'monster' && (
                <button
                  onClick={() => toggleHpVisibility(selectedEntity)}
                  className="w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded"
                >
                  {entities.find(e => e.id === selectedEntity)?.hideHp ? 'Show HP' : 'Hide HP'}
                </button>
              )}
              <button
                onClick={() => deleteEntity(selectedEntity)}
                className="w-full bg-red-700 hover:bg-red-800 px-3 py-2 rounded flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-auto bg-gray-800 rounded-lg p-4">
        <div className="inline-block">
          {Array.from({ length: gridSize.rows }).map((_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: gridSize.cols }).map((_, col) => {
                const entity = getEntityAt(row, col);
                const obj = getObjectAt(row, col);
                return (
                  <div
                    key={`${row}-${col}`}
                    className={`w-10 h-10 border border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors ${
                      selectedEntity && entity?.id === selectedEntity ? 'ring-2 ring-yellow-400' : ''
                    }`}
                    onClick={() => {
                      if (selectedEntity) {
                        moveEntity(selectedEntity, row, col);
                      }
                    }}
                  >
                    {entity && (
                      <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: entity.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntity(entity.id);
                        }}
                      >
                        {entity.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    {obj && !entity && (
                      <div
                        className="w-full h-full flex items-center justify-center text-xs"
                        style={{ backgroundColor: obj.color, opacity: 0.7 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete ${obj.name}?`)) {
                            deleteObject(obj.id);
                          }
                        }}
                      >
                        <Box size={16} />
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              Add {modalType === 'player' ? 'Player' : 'Monster'}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newEntity.name}
                onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
              <input
                type="number"
                placeholder="Max HP"
                value={newEntity.maxHp}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 20;
                  setNewEntity({ ...newEntity, maxHp: val, hp: val });
                }}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
              <input
                type="number"
                placeholder="Initiative"
                value={newEntity.initiative}
                onChange={(e) => setNewEntity({ ...newEntity, initiative: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={addEntity}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add Object</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Object name (e.g., Tree, Rock)"
                value={newObject.name}
                onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={addObject}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowObjectModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
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
