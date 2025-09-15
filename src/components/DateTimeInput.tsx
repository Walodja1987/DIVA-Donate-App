import React, { useState, useRef, useEffect } from 'react';

interface DateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface Segment {
  key: string;
  placeholder: string;
  maxLength: number;
  validator: (value: string) => boolean;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ 
  value, 
  onChange, 
  className = ""
}) => {
  const [activeSegment, setActiveSegment] = useState(0);
  const [segments, setSegments] = useState<string[]>(['', '', '', '', '', '00']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const segmentConfig: Segment[] = [
    { key: 'day', placeholder: 'DD', maxLength: 2, validator: (val) => /^\d{1,2}$/.test(val) && parseInt(val) >= 1 && parseInt(val) <= 31 },
    { key: 'month', placeholder: 'MM', maxLength: 2, validator: (val) => /^\d{1,2}$/.test(val) && parseInt(val) >= 1 && parseInt(val) <= 12 },
    { key: 'year', placeholder: 'YYYY', maxLength: 4, validator: (val) => /^\d{1,4}$/.test(val) && parseInt(val) >= 2024 },
    { key: 'hours', placeholder: 'HH', maxLength: 2, validator: (val) => /^\d{1,2}$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 23 },
    { key: 'minutes', placeholder: 'MM', maxLength: 2, validator: (val) => /^\d{1,2}$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 59 },
    { key: 'seconds', placeholder: 'SS', maxLength: 2, validator: (val) => /^\d{1,2}$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 59 }
  ];

  // Parse the input value into segments
  useEffect(() => {
    if (value && value !== 'DD-MM-YYYY, HH:MM') {
      // Split by comma first to separate date and time
      const [datePart, timePart] = value.split(',');
      
      if (datePart && timePart) {
        // Parse date part: DD-MM-YYYY
        const dateSegments = datePart.trim().split('-');
        // Parse time part: HH:MM:SS (seconds will be set to 00)
        const timeSegments = timePart.trim().split(':');
        
        const newSegments = ['', '', '', '', '', '00'];
        
        // Set date segments
        if (dateSegments.length >= 3) {
          newSegments[0] = dateSegments[0] || '';
          newSegments[1] = dateSegments[1] || '';
          newSegments[2] = dateSegments[2] || '';
        }
        
        // Set time segments (hours and minutes only, seconds always 00)
        if (timeSegments.length >= 2) {
          newSegments[3] = timeSegments[0] || '';
          newSegments[4] = timeSegments[1] || '';
          // newSegments[5] is already set to '00'
        }
        
        setSegments(newSegments);
      }
    }
  }, [value]);

  // Update the full value when segments change
  useEffect(() => {
    const fullValue = `${segments[0] || 'DD'}-${segments[1] || 'MM'}-${segments[2] || 'YYYY'}, ${segments[3] || 'HH'}:${segments[4] || 'MM'}:00`;
    onChange(fullValue);
  }, [segments, onChange]);

  const handleInputChange = (index: number, inputValue: string) => {
    const newSegments = [...segments];
    newSegments[index] = inputValue;
    setSegments(newSegments);

    // Auto-advance to next segment if current is complete and valid
    if (inputValue.length === segmentConfig[index].maxLength && segmentConfig[index].validator(inputValue)) {
      if (index < segmentConfig.length - 1) {
        setActiveSegment(index + 1);
        setTimeout(() => {
          const nextInput = inputRefs.current[index + 1];
          if (nextInput) {
            nextInput.focus();
            nextInput.select(); // Select all text in the next field
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && segments[index] === '' && index > 0) {
      // Move to previous segment on backspace when current is empty
      setActiveSegment(index - 1);
      setTimeout(() => {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          prevInput.select(); // Select all text in the previous field
        }
      }, 0);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveSegment(index - 1);
      setTimeout(() => {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          prevInput.select(); // Select all text in the previous field
        }
      }, 0);
    } else if (e.key === 'ArrowRight' && index < segmentConfig.length - 1) {
      setActiveSegment(index + 1);
      setTimeout(() => {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
          nextInput.select(); // Select all text in the next field
        }
      }, 0);
    }
  };

  const handleFocus = (index: number) => {
    setActiveSegment(index);
    // Select all text when focusing on a field
    setTimeout(() => {
      const input = inputRefs.current[index];
      if (input) {
        input.select();
      }
    }, 0);
  };

  const handleClick = (index: number) => {
    setActiveSegment(index);
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select(); // Select all text when clicking on a field
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-1 text-sm font-mono">
        {/* Day */}
        <input
          ref={(el) => (inputRefs.current[0] = el)}
          type="text"
          value={segments[0]}
          onChange={(e) => handleInputChange(0, e.target.value)}
          onKeyDown={(e) => handleKeyDown(0, e)}
          onFocus={() => handleFocus(0)}
          onClick={() => handleClick(0)}
          placeholder="DD"
          maxLength={2}
          className={`w-8 text-center border rounded px-1 py-1 ${
            activeSegment === 0 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : 'border-gray-300 bg-white'
          } focus:outline-none`}
        />
        <span className="text-gray-400">-</span>
        
        {/* Month */}
        <input
          ref={(el) => (inputRefs.current[1] = el)}
          type="text"
          value={segments[1]}
          onChange={(e) => handleInputChange(1, e.target.value)}
          onKeyDown={(e) => handleKeyDown(1, e)}
          onFocus={() => handleFocus(1)}
          onClick={() => handleClick(1)}
          placeholder="MM"
          maxLength={2}
          className={`w-8 text-center border rounded px-1 py-1 ${
            activeSegment === 1 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : 'border-gray-300 bg-white'
          } focus:outline-none`}
        />
        <span className="text-gray-400">-</span>
        
        {/* Year */}
        <input
          ref={(el) => (inputRefs.current[2] = el)}
          type="text"
          value={segments[2]}
          onChange={(e) => handleInputChange(2, e.target.value)}
          onKeyDown={(e) => handleKeyDown(2, e)}
          onFocus={() => handleFocus(2)}
          onClick={() => handleClick(2)}
          placeholder="YYYY"
          maxLength={4}
          className={`w-12 text-center border rounded px-1 py-1 ${
            activeSegment === 2 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : 'border-gray-300 bg-white'
          } focus:outline-none`}
        />
        <span className="text-gray-400">,</span>
        
        {/* Hours */}
        <input
          ref={(el) => (inputRefs.current[3] = el)}
          type="text"
          value={segments[3]}
          onChange={(e) => handleInputChange(3, e.target.value)}
          onKeyDown={(e) => handleKeyDown(3, e)}
          onFocus={() => handleFocus(3)}
          onClick={() => handleClick(3)}
          placeholder="HH"
          maxLength={2}
          className={`w-8 text-center border rounded px-1 py-1 ${
            activeSegment === 3 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : 'border-gray-300 bg-white'
          } focus:outline-none`}
        />
        <span className="text-gray-400">:</span>
        
        {/* Minutes */}
        <input
          ref={(el) => (inputRefs.current[4] = el)}
          type="text"
          value={segments[4]}
          onChange={(e) => handleInputChange(4, e.target.value)}
          onKeyDown={(e) => handleKeyDown(4, e)}
          onFocus={() => handleFocus(4)}
          onClick={() => handleClick(4)}
          placeholder="MM"
          maxLength={2}
          className={`w-8 text-center border rounded px-1 py-1 ${
            activeSegment === 4 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : 'border-gray-300 bg-white'
          } focus:outline-none`}
        />
        <span className="text-gray-400">:</span>
        
        {/* Seconds */}
        <input
          ref={(el) => (inputRefs.current[5] = el)}
          type="text"
          value="00"
          disabled
          placeholder="SS"
          maxLength={2}
          className="w-8 text-center border rounded px-1 py-1 border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default DateTimeInput;