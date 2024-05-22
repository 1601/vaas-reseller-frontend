import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const intervalManager = () => {
    let intervalIds = [];

    const setTrackedInterval = (callback, interval) => {
        const id = setInterval(callback, interval);
        intervalIds.push(id);
        return id;
    };

    const clearAllIntervals = () => {
        intervalIds.forEach(clearInterval);
        intervalIds = [];
    };

    return { setTrackedInterval, clearAllIntervals };
};

export default intervalManager;
