import React from 'react';
import { RadioGroup } from '@headlessui/react';

interface ResizeOptionsProps {
  config: {
    width: number | null;
    height: number | null;
    maintainAspectRatio: boolean;
    quality: number;
    format: 'jpeg' | 'png' | 'webp';
  };
  originalDimensions: { width: number, height: number } | null;
  onChange: (config: Partial<typeof ResizeOptionsProps.prototype.config>) => void;
}

const presets = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
];

const ResizeOptions: React.FC<ResizeOptionsProps> = ({ config, originalDimensions, onChange }) => {
  const handlePresetSelect = (preset: { width: number, height: number }) => {
    onChange({
      width: preset.width,
      height: preset.height,
      maintainAspectRatio: false, // Presets override aspect ratio
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Social Media Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className="text-left px-3 py-2 border rounded-md text-sm hover:bg-gray-50 hover:border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{preset.width} × {preset.height}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dimensions</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-full">
                <label htmlFor="width" className="block text-xs text-gray-500 dark:text-gray-400">
                  Width (px)
                </label>
                <input
                  type="number"
                  id="width"
                  value={config.width || ''}
                  onChange={(e) => onChange({ width: e.target.value ? parseInt(e.target.value) : null })}
                  min="1"
                  max="10000"
                  className="input mt-1"
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="height" className="block text-xs text-gray-500 dark:text-gray-400">
                  Height (px)
                </label>
                <input
                  type="number"
                  id="height"
                  value={config.height || ''}
                  onChange={(e) => onChange({ height: e.target.value ? parseInt(e.target.value) : null })}
                  min="1"
                  max="10000"
                  className="input mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="aspect-ratio"
                checked={config.maintainAspectRatio}
                onChange={(e) => onChange({ maintainAspectRatio: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="aspect-ratio" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Maintain aspect ratio
              </label>
            </div>
            
            {originalDimensions && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onChange({ 
                    width: Math.round(originalDimensions.width / 2), 
                    height: Math.round(originalDimensions.height / 2) 
                  })}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  50%
                </button>
                <button
                  onClick={() => onChange({ 
                    width: Math.round(originalDimensions.width / 4), 
                    height: Math.round(originalDimensions.height / 4) 
                  })}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  25%
                </button>
                <button
                  onClick={() => onChange({ 
                    width: originalDimensions.width, 
                    height: originalDimensions.height 
                  })}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Original
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="quality" className="block text-xs text-gray-500 dark:text-gray-400">
                Quality: {config.quality}%
              </label>
              <input
                type="range"
                id="quality"
                min="10"
                max="100"
                value={config.quality}
                onChange={(e) => onChange({ quality: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-1"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Format
              </label>
              <RadioGroup value={config.format} onChange={(value) => onChange({ format: value as 'jpeg' | 'png' | 'webp' })}>
                <div className="flex space-x-4">
                  {['jpeg', 'png', 'webp'].map((format) => (
                    <RadioGroup.Option
                      key={format}
                      value={format}
                      className={({ active, checked }) =>
                        `${
                          active ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                        } ${
                          checked ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-gray-200'
                        } relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
                      }
                    >
                      {({ checked }) => (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-medium ${
                                  checked ? 'text-white' : 'text-gray-900 dark:text-gray-200'
                                }`}
                              >
                                {format.toUpperCase()}
                              </RadioGroup.Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizeOptions;
