import React from 'react';

export const FirmwareArchitecture: React.FC = () => {
    return (
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-sm space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <h4 className="text-sm text-blue-400 font-bold mb-2 uppercase tracking-wide">State Machine</h4>
                    <ul className="space-y-2 text-xs text-slate-300 font-mono">
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-600 mr-2"></span>BOOTLOADER</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-500 mr-2"></span>IDLE / ADVERTISING</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>CONNECTED_ACTIVE</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>OTA_UPDATE_PENDING</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-purple-400 font-bold mb-2 uppercase tracking-wide">Scheduler</h4>
                    <div className="text-xs text-slate-300">
                        RTOS FreeRTOS kernel.
                        <div className="mt-2 pl-2 border-l border-white/10 space-y-1">
                            <div>P1: Sensor Acquisition (Hard Real-time)</div>
                            <div>P2: BLE Stack (SoftDevice)</div>
                            <div>P3: Supervisor / Houskeeping</div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm text-pink-400 font-bold mb-2 uppercase tracking-wide">BLE Packet Structure</h4>
                    <div className="font-mono text-[10px] text-slate-400 bg-black/40 p-2 rounded border border-white/5">
                        | Header (1B) | Timestamp (4B) | Payload (12B) | CRC (2B) |
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Payload dynamic based on OpCode (0x01: Raw, 0x02: Event, 0x99: Error)</p>
                </div>
            </div>
        </div>
    );
};
