import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function PromptDial({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 1, 
    step = 0.01, 
    leftLabel, 
    rightLabel,
    colorStart = '#a78bfa', // Violet-400
    colorEnd = '#7c3aed'    // Violet-700
}) {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const handleInteractionMoveRef = useRef(null);
    const handleInteractionEndRef = useRef(null);

    // Sync external value
    useEffect(() => {
        if (!isDragging) {
            setLocalValue(value);
        }
    }, [value, isDragging]);

    const clamp = useCallback((num, minVal, maxVal) => Math.min(Math.max(num, minVal), maxVal), []);

    // Stable calculation function
    const calculateValueFromEvent = useCallback((e) => {
        if (!sliderRef.current) return localValue;
        const rect = sliderRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left;
        const width = rect.width;
        if (width === 0) return localValue;
        let rawValue = (x / width) * (max - min) + min;
        let steppedValue = Math.round(rawValue / step) * step;
        return clamp(steppedValue, min, max);
    }, [localValue, min, max, step, clamp]); 

    // --- Event Handler Logic using Refs ---
    // Define the MOVE logic, store in ref
    useEffect(() => {
        handleInteractionMoveRef.current = (e) => {
            if (e.touches) e.preventDefault(); 
            const newValue = calculateValueFromEvent(e);
            setLocalValue(newValue); 
            onChange(newValue);     
        };
    }, [calculateValueFromEvent, onChange]);

    // Define the END logic (just set state), store in ref
    useEffect(() => {
        handleInteractionEndRef.current = () => {
            setIsDragging(false);
            // Listeners are removed by the isDragging effect cleanup
        };
    }, []);

    // *** Effect to add/remove listeners based on isDragging state ***
    useEffect(() => {
        const moveHandler = handleInteractionMoveRef.current;
        const endHandler = handleInteractionEndRef.current;
        
        if (isDragging) {
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', endHandler);
            document.addEventListener('touchmove', moveHandler, { passive: false });
            document.addEventListener('touchend', endHandler);
        }

        // Cleanup function
        return () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endHandler);
        };
    }, [isDragging]); // Only re-run when isDragging changes

    // Interaction START handler (only sets state now)
    const handleInteractionStart = useCallback((e) => {
        if (e.button && e.button !== 0) return;
        if (e.touches) e.preventDefault();

        const newValue = calculateValueFromEvent(e);
        setLocalValue(newValue);
        onChange(newValue);
        setIsDragging(true); // Trigger the effect to add listeners
        
    }, [calculateValueFromEvent, onChange]); 

    // Keyboard handler
    const handleKeyDown = useCallback((e) => {
        let newValue = localValue;
        let valueChanged = false;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            newValue = clamp(localValue - step, min, max);
            valueChanged = true;
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            newValue = clamp(localValue + step, min, max);
            valueChanged = true;
        } else if (e.key === 'PageDown') {
            newValue = clamp(localValue - step * 10, min, max);
            valueChanged = true;
        } else if (e.key === 'PageUp') {
            newValue = clamp(localValue + step * 10, min, max);
            valueChanged = true;
        } else if (e.key === 'Home') {
            newValue = min;
            valueChanged = true;
        } else if (e.key === 'End') {
            newValue = max;
            valueChanged = true;
        }
        if (valueChanged && newValue !== localValue) {
            e.preventDefault(); 
            setLocalValue(newValue);
            onChange(newValue);
        }
    }, [localValue, min, max, step, onChange, clamp]); 

    const percentage = ((localValue - min) / (max - min)) * 100;
    const gradientStyle = {
        background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`
    };

    return (
        <div className="w-full">
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 text-center">{label}</label>
            <div 
                ref={sliderRef}
                className="relative h-2 rounded-full bg-zinc-700 cursor-pointer group touch-none"
                onMouseDown={handleInteractionStart} 
                onTouchStart={handleInteractionStart}
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={localValue}
                aria-label={label}
                tabIndex="0" 
                onKeyDown={handleKeyDown}
            >
                {/* Track fill */}
                <div 
                    className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
                    style={{ ...gradientStyle, width: `${percentage}%` }}
                />
                
                {/* Slider knob (thumb) */}
                <div 
                    className={`absolute h-4 w-4 bg-white rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 top-1/2 transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}
                    style={{ left: `${percentage}%` }}
                    onMouseDown={handleInteractionStart} 
                    onTouchStart={handleInteractionStart}
                />
            </div>
            
            {/* Optional min/max labels */}
            {(leftLabel || rightLabel) && (
                <div className="flex justify-between mt-1.5 text-xs text-zinc-400">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            )}
        </div>
    );
}

PromptDial.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    leftLabel: PropTypes.string,
    rightLabel: PropTypes.string,
    colorStart: PropTypes.string,
    colorEnd: PropTypes.string
};

export default PromptDial;