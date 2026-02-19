const fs = require('fs');
const path = require('path');

const pdfDir = 'C:\\Users\\zSixt\\Desktop\\patent pdfs';

// Files in correct reading order with descriptive names
const renameMap = [
    // Cover
    ['provisional_cover_sheet.pdf', '01_Cover_Sheet.pdf'],

    // Spec Page 1 (two copies exist)
    ['spec_page1.pdf', '02_Spec_Field_and_System_Overview.pdf'],
    ['spec_page1 (1).pdf', '03_Spec_Field_and_System_Overview_Copy.pdf'],

    // Pre-page (node disclosure overview)
    ['Provisional_Specification_Pre_Page.pdf', '04_Spec_Node_Disclosure_Overview.pdf'],

    // Spec Pages 2-9
    ['Provisional_Specification_Page_2.pdf', '05_Spec_Background_and_Limitations.pdf'],
    ['Provisional_Specification_Page_3.pdf', '06_Spec_Summary_of_Invention.pdf'],
    ['Provisional_Specification_Page_4.pdf', '07_Spec_Brief_Description_of_Drawings.pdf'],
    ['Provisional_Specification_Page_5.pdf', '08_Spec_Definitions_and_Terminology.pdf'],
    ['Provisional_Specification_Page_6.pdf', '09_Spec_System_Architecture_Overview.pdf'],
    ['Provisional_Specification_Page_7.pdf', '10_Spec_Data_Pipeline_and_Metrics.pdf'],
    ['Provisional_Specification_Page_8.pdf', '11_Spec_General_Embodiments_Variations.pdf'],
    ['Provisional_Specification_Page_9.pdf', '12_Spec_Detailed_Description.pdf'],

    // Spec Pages 10-14 (Node overviews in main spec)
    ['Provisional_Specification_Page_10.pdf', '13_Spec_Node1_External_Monitor.pdf'],
    ['Provisional_Specification_Page_11.pdf', '14_Spec_Node2_Intravaginal_Monitor.pdf'],
    ['Provisional_Specification_Page_12.pdf', '15_Spec_Node3_Geometry_Scanner.pdf'],
    ['Provisional_Specification_Page_13.pdf', '16_Spec_Node4_Intraluminal_Device.pdf'],
    ['Provisional_Specification_Page_14.pdf', '17_Spec_Node5_UpperBody_Context.pdf'],

    // Spec Pages 15-24
    ['Provisional_Specification_Page_15.pdf', '18_Spec_Cross_Device_Correlation.pdf'],
    ['Provisional_Specification_Page_16.pdf', '19_Spec_Cross_User_Correlation.pdf'],
    ['Provisional_Specification_Page_17.pdf', '20_Spec_Example_Workflows.pdf'],
    ['Provisional_Specification_Page_18.pdf', '21_Spec_Privacy_Security_Governance.pdf'],
    ['Provisional_Specification_Page_19.pdf', '22_Spec_Computing_System_Software.pdf'],
    ['Provisional_Specification_Page_20.pdf', '23_Spec_Example_Claims.pdf'],
    ['Provisional_Specification_Page_21.pdf', '24_Spec_Figures_Reference_Numerals.pdf'],
    ['Provisional_Specification_Page_22.pdf', '25_Spec_Definitions_Interpretation.pdf'],
    ['Provisional_Specification_Page_23.pdf', '26_Spec_Advantages_Industrial_Applicability.pdf'],
    ['Provisional_Specification_Page_24.pdf', '27_Spec_Abstract_Final_Notes.pdf'],

    // Appendices (Spec Pages 26-38, skipping missing 25/33)
    ['Provisional_Specification_Page_26.pdf', '28_AppB_Parameters_Sampling_Quality.pdf'],
    ['Provisional_Specification_Page_27.pdf', '29_AppC_Consent_Sharing_Access.pdf'],
    ['Provisional_Specification_Page_28.pdf', '30_AppD_Materials_Sealing_Power.pdf'],
    ['Provisional_Specification_Page_29.pdf', '31_AppE_Privacy_Output_Formats_UI.pdf'],
    ['Provisional_Specification_Page_30.pdf', '32_AppF_Validation_AntiSpoof_Integrity.pdf'],
    ['Provisional_Specification_Page_31.pdf', '33_AppG_Metrics_Indices_Features.pdf'],
    ['Provisional_Specification_Page_32.pdf', '34_AppH_Embodiment_Combinations.pdf'],
    ['Provisional_Specification_Page_34.pdf', '35_AppJ_Kits_Accessories_Packaging.pdf'],
    ['Provisional_Specification_Page_35.pdf', '36_AppK_Comms_Sync_Data_Pipeline.pdf'],
    ['Provisional_Specification_Page_36.pdf', '37_AppL_Exemplar_Claims.pdf'],
    ['Provisional_Specification_Page_37.pdf', '38_AppM_Figures_Drawings_Labels.pdf'],
    ['Provisional_Specification_Page_38.pdf', '39_AppN_Definitions_Interpretation_Rules.pdf'],

    // Node 1 detailed pages
    ['Provisional_Node1_Page_1.pdf', '40_Node1_Technical_Field_Summary.pdf'],
    ['Provisional_Node1_Page_2.pdf', '41_Node1_Sampling_Quality_Outputs.pdf'],
    ['Provisional_Node1_Page_3.pdf', '42_Node1_Mechanical_Power_Comms.pdf'],
    ['Provisional_Node1_Page_4.pdf', '43_Node1_Claim_Statements.pdf'],

    // Node 2 detailed pages
    ['Provisional_Node2_Page_1.pdf', '44_Node2_Technical_Field_Summary.pdf'],
    ['Provisional_Node2_Page_2.pdf', '45_Node2_Sampling_Quality_Outputs.pdf'],
    ['Provisional_Node2_Page_3.pdf', '46_Node2_Mechanical_Electrodes_Power.pdf'],
    ['Provisional_Node2_Page_4.pdf', '47_Node2_Claim_Statements.pdf'],

    // Node 3 detailed pages
    ['Provisional_Node3_Page_1.pdf', '48_Node3_Technical_Field_Summary.pdf'],
    ['Provisional_Node3_Page_2.pdf', '49_Node3_Scan_Validation_AntiSpoof.pdf'],
    ['Provisional_Node3_Page_3.pdf', '50_Node3_Hardware_Power_Standalone.pdf'],
    ['Provisional_Node3_Page_4.pdf', '51_Node3_Claim_Statements.pdf'],

    // Node 4 detailed pages
    ['Provisional_Node4_Page_1.pdf', '52_Node4_Technical_Field_Summary.pdf'],
    ['Provisional_Node4_Page_3.pdf', '53_Node4_Hardware_Actuation_Power.pdf'],
    ['Provisional_Node4_Page_4.pdf', '54_Node4_Claim_Statements.pdf'],

    // Node 5 detailed pages
    ['Provisional_Node5_Page_1.pdf', '55_Node5_Technical_Field_Summary.pdf'],
    ['Provisional_Node5_Page_2.pdf', '56_Node5_Features_Quality_Interpretation.pdf'],
    ['Provisional_Node5_Page_3.pdf', '57_Node5_Hardware_Power_Standalone.pdf'],
    ['Provisional_Node5_Page_4.pdf', '58_Node5_Claim_Statements.pdf'],

    // Vibration / Haptics pages
    ['Node_1_Vibration_Haptics_Page.pdf', '59_Haptics_Node1_Preliminary.pdf'],
    ['Provisional_Node1_Vibration_Haptics_Page_1.pdf', '60_Haptics_Node1_Guidance_Feedback.pdf'],
    ['Provisional_Node1_Vibration_Haptics_Page_2.pdf', '61_Haptics_Node1_ClosedLoop_Consent.pdf'],
    ['Node_2_Vibration_Haptics_Page.pdf', '62_Haptics_Node2_Internal_Stimulus.pdf'],
    ['Node_3_Vibration_Haptics_Page.pdf', '63_Haptics_Node3_Tactile_Guidance.pdf'],
    ['Node_4_Vibration_Haptics_Page.pdf', '64_Haptics_Node4_Mechanical_Stimulus.pdf'],
    ['Node_5_Vibration_Haptics_Page.pdf', '65_Haptics_Node5_Somatic_Feedback.pdf'],

    // Ultrasound Endpoint pages
    ['Provisional_Node4_Ultrasound_Endpoint_Page_1.pdf', '66_Ultrasound_Technical_Field_Summary.pdf'],
    ['Provisional_Node4_Ultrasound_Endpoint_Page_2.pdf', '67_Ultrasound_Modes_Calibration_Quality.pdf'],
    ['Provisional_Node4_Ultrasound_Endpoint_Page_3.pdf', '68_Ultrasound_MultiAxis_Robustness.pdf'],

    // Node 5 Context Anchor pages
    ['Provisional_Node5_Context_Anchor_Page_1.pdf', '69_Context_Anchor_State_Artifact_Control.pdf'],
    ['Provisional_Node5_Context_Anchor_Page_2.pdf', '70_Context_Anchor_Architecture_State.pdf'],
    ['Provisional_Node5_Context_Anchor_Page_3.pdf', '71_Context_Anchor_Baselines_Longitudinal.pdf'],

    // Security & Privacy pages
    ['Provisional_Security_Privacy_Page_1.pdf', '72_Security_Encryption_Key_Mgmt.pdf'],
    ['Provisional_Security_Privacy_Page_2.pdf', '73_Security_Boot_Firmware_Audit.pdf'],
    ['Provisional_Security_Privacy_Page_3.pdf', '74_Privacy_By_Design_Abstraction.pdf'],

    // Specialty pages
    ['Sensor_Derived_Sigil_Compatibility_Visualization_Page.pdf', '75_Sigil_Abstract_Visualization.pdf'],
    ['Future_Proof_Symbolic_Compatibility_Framework_Page.pdf', '76_FutureProof_Symbolic_Framework.pdf'],
];

let success = 0;
let errors = 0;

for (const [oldName, newName] of renameMap) {
    const oldPath = path.join(pdfDir, oldName);
    const newPath = path.join(pdfDir, newName);
    try {
        if (!fs.existsSync(oldPath)) {
            console.log(`SKIP (not found): ${oldName}`);
            errors++;
            continue;
        }
        fs.renameSync(oldPath, newPath);
        console.log(`OK: ${oldName} -> ${newName}`);
        success++;
    } catch (err) {
        console.log(`ERROR: ${oldName} -> ${err.message}`);
        errors++;
    }
}

console.log(`\nDone. ${success} renamed, ${errors} errors/skipped.`);
