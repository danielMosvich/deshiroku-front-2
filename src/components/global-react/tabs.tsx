import React, { useState, useRef, useEffect } from "react";
import "./styles/tabs.css";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  size?: "sm" | "md" | "lg" | "xl";
  padding?: string;
  full?: "fit-content" | "full";
  className?: string;
}

function Tabs({
  tabs,
  rounded = "none",
  size = "md",
  padding = "4px",
  full = "fit-content",
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tabStyle, setTabStyle] = useState({ width: 0, left: 0 });

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      setTabStyle({
        width: currentTab.offsetWidth,
        left: currentTab.offsetLeft,
      });
      // console.log(currentTab.offsetLeft);
    }
  }, [activeTab]);

  return (
    <div className={`tabs ${className}`}>
      <div
        style={{ width: full === "fit-content" ? "fit-content" : "100%" }}
        className={`tab-buttons size_${size} rounded-${rounded}`}
      >
        <div
          className="tab-color"
          style={{ width: tabStyle.width, left: tabStyle.left, padding }}
        >
          <div className={`tab-color-child rounded-${rounded}`}></div>
        </div>
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`tab-button font-ui ${
              activeTab === index ? "active" : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab-panel ${activeTab === index ? "active" : ""}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
