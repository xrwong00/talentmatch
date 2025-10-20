"use client";

import { useState } from "react";
import CareerAgentChat from "./CareerAgentChat";

export default function AIAgentButton() {
  const [showAIAgent, setShowAIAgent] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowAIAgent(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl z-40 hover:scale-110"
        title="Open AI Career Agent"
        aria-label="Open AI Career Agent"
      >
        🤖
      </button>

      {showAIAgent && (
        <CareerAgentChat onClose={() => setShowAIAgent(false)} />
      )}
    </>
  );
}




