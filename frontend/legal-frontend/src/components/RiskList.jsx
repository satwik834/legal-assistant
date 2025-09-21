import React from 'react'

export default function RiskList({risks, onSelect}) {
    if (!risks || risks.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-medium text-black">Risks Detected</h2>
                    <p className="text-sm text-gray-600 mt-1">0 risks found</p>
                </div>
                <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No risks detected!</h3>
                    <p className="text-gray-600">This document appears to be clean with no identified legal risks.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg bg-white h-4/12 overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-black">Risks Detected</h2>
                <p className="text-sm text-gray-600 mt-1">{risks.length} risk{risks.length > 1 ? 's' : ''} found</p>
            </div>

            <div className="divide-y divide-gray-200">
                {risks.map((risk, i) => (
                    <div key={i} className="p-6">
                        <div className="space-y-3">
                            <div
                                key={i}
                                onClick={() => onSelect(i)}
                                className="cursor-pointer mb-4 p-3 bg-red-50 border-l-4 border-red-400 hover:bg-red-100 rounded"                                >
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Clause:</h3>
                                <p className=" text-gray-900 leading-relaxed">{risk.text}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Identified Risks:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {risk.risks.map((riskItem, j) => (
                                        <span
                                            key={j}
                                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full border border-gray-200"
                                        >
                                            {riskItem}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}