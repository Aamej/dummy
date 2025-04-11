import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export function useUI() {
  return useContext(UIContext);
}

export function UIProvider({ children }) {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState('nodes'); // 'nodes', 'properties', 'settings'
  
  // Canvas state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  
  // Modal states
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Tutorial state
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Notification state
  const [notification, setNotification] = useState(null);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Show notification
  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type, duration });
    
    // Auto-dismiss notification after duration
    if (duration > 0) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };
  
  // Clear notification
  const clearNotification = () => {
    setNotification(null);
  };
  
  // Start tutorial
  const startTutorial = () => {
    setIsTutorialActive(true);
    setTutorialStep(0);
  };
  
  // End tutorial
  const endTutorial = () => {
    setIsTutorialActive(false);
    setTutorialStep(0);
  };
  
  // Next tutorial step
  const nextTutorialStep = () => {
    setTutorialStep(tutorialStep + 1);
  };
  
  // Previous tutorial step
  const prevTutorialStep = () => {
    setTutorialStep(Math.max(0, tutorialStep - 1));
  };
  
  // Reset zoom and pan
  const resetView = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };
  
  const value = {
    // Sidebar
    isSidebarOpen,
    activePanel,
    setActivePanel,
    toggleSidebar,
    
    // Canvas
    zoomLevel,
    setZoomLevel,
    panPosition,
    setPanPosition,
    resetView,
    
    // Modals
    isHelpModalOpen,
    setIsHelpModalOpen,
    isSaveModalOpen,
    setIsSaveModalOpen,
    isLoadModalOpen,
    setIsLoadModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    
    // Tutorial
    isTutorialActive,
    tutorialStep,
    startTutorial,
    endTutorial,
    nextTutorialStep,
    prevTutorialStep,
    
    // Notification
    notification,
    showNotification,
    clearNotification,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
