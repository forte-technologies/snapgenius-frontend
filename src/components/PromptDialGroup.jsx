import React from 'react';
import PropTypes from 'prop-types';
import PromptDial from './PromptDial';

const dialConfigs = [
    { key: 'tone', label: 'Tone', left: 'Casual', right: 'Formal' },
    { key: 'complexity', label: 'Complexity', left: 'Simple', right: 'Advanced' },
    { key: 'focus', label: 'Focus', left: 'Narrow', right: 'Broad' },
    { key: 'depth', label: 'Depth', left: 'Concise', right: 'Thorough' },
    { key: 'clarity', label: 'Clarity', left: 'Ambiguous', right: 'Clear' },
];

function PromptDialGroup({ settings, onSettingsChange }) {

    const handleDialChange = (key, newValue) => {
        onSettingsChange(prevSettings => ({
            ...prevSettings,
            [key]: newValue,
        }));
    };

    return (
        <div className="space-y-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 shadow-inner">
            <h3 className="text-sm font-medium text-center text-zinc-200 mb-3">Prompt Tuner</h3>
            {dialConfigs.map(({ key, label, left, right }) => (
                <PromptDial
                    key={key}
                    label={label}
                    value={settings[key]}
                    onChange={(newValue) => handleDialChange(key, newValue)}
                    leftLabel={left}
                    rightLabel={right}
                />
            ))}
        </div>
    );
}

PromptDialGroup.propTypes = {
    settings: PropTypes.shape({
        tone: PropTypes.number.isRequired,
        complexity: PropTypes.number.isRequired,
        focus: PropTypes.number.isRequired,
        depth: PropTypes.number.isRequired,
        clarity: PropTypes.number.isRequired,
    }).isRequired,
    onSettingsChange: PropTypes.func.isRequired,
};

export default PromptDialGroup; 