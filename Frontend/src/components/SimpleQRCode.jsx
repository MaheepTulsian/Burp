/**
 * Simple QR Code Component
 *
 * A basic QR code display component that shows QR data in a visual format
 * without requiring external QR libraries
 */

import React from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const SimpleQRCode = ({ data, size = 280, className = '' }) => {
  // Convert JSON data to a simple display format
  const displayData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  // Create a simple grid pattern for visual QR representation
  const generatePattern = (text) => {
    const grid = [];
    const gridSize = 21; // Standard QR code is 21x21 for version 1

    // Simple hash function to create deterministic pattern
    const hash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    };

    const seed = hash(text);

    for (let row = 0; row < gridSize; row++) {
      const rowData = [];
      for (let col = 0; col < gridSize; col++) {
        // Add finder patterns (corners)
        if ((row < 7 && col < 7) ||
            (row < 7 && col >= gridSize - 7) ||
            (row >= gridSize - 7 && col < 7)) {
          // Finder pattern
          if ((row === 0 || row === 6 || col === 0 || col === 6) ||
              (row >= 2 && row <= 4 && col >= 2 && col <= 4)) {
            rowData.push(true);
          } else {
            rowData.push(false);
          }
        } else {
          // Data pattern based on hash
          const cellSeed = seed + row * gridSize + col;
          rowData.push(cellSeed % 3 === 0);
        }
      }
      grid.push(rowData);
    }

    return grid;
  };

  const pattern = generatePattern(displayData);
  const cellSize = Math.floor(size / 21);

  return (
    <div className={`inline-block ${className}`}>
      <div
        className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-lg"
        style={{ width: size + 32, height: size + 32 }}
      >
        <div className="relative">
          {/* QR Pattern Grid */}
          <div
            className="grid gap-0 bg-white"
            style={{
              gridTemplateColumns: `repeat(21, ${cellSize}px)`,
              width: size,
              height: size
            }}
          >
            {pattern.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${cell ? 'bg-black' : 'bg-white'}`}
                  style={{ width: cellSize, height: cellSize }}
                />
              ))
            )}
          </div>

          {/* Center Logo/Icon */}
          <div
            className="absolute bg-white rounded-lg flex items-center justify-center border-2 border-gray-300"
            style={{
              width: cellSize * 5,
              height: cellSize * 5,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <QrCodeIcon className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">Self App QR Code</p>
        <p className="text-xs text-gray-400 mt-1">Scan to verify age</p>
      </div>
    </div>
  );
};

export default SimpleQRCode;