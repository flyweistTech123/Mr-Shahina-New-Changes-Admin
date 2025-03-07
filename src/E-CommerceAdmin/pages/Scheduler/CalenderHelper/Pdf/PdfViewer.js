/** @format */

const PdfViewer = ({ data }) => {
  return (
    <div className="pdfs">
      {data?.map((i, index) => {
        let url;
        if (
          i.filename === "painless prp hair loss treatment" ||
          i.filename === "pigment reduction by aerolase"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/PRPHAIRLOSSTREATMENTPREPOSTCAREGUIDE.pdf";
        } else if (i.filename === "pro clinical peel") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/ProClinicalPeelForm.pdf";
        } else if (
          i.filename === "dermamelan peel" ||
          i.filename === "DermamelanPeelPre.pdf"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/DermamelanPeelPre.pdf";
        } else if (i.filename === "perfect derma peel") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/ThePerfectDermaPeel.pdf";
        } else if (i.filename === "acne peel") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Acne+Peel.pdf";
        } else if (i.filename === "aquagold microneedling") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/AQUAGOLD.pdf";
        } else if (
          i.filename === "lycine/proline iv" ||
          i.filename === "glutathione iv"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/IV+THERAPY.pdf";
        } else if (
          i.filename === "enlighten md peel" ||
          i.filename === "enlighten peel" ||
          i.filename === "revepeel"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Enlighten+Peel.pdf";
        } else if (
          i.filename === "prp microneedling" ||
          i.filename === "microneedling" ||
          i.filename === "salmon sperm dna facial"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/PRPMicroneedlingPre%26PostCare.pdf";
        } else if (i.filename === "cosmelan md peel") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/PreandPostCosmelanDepigmentationInstructions.pdf";
        } else if (i.filename === "dmk enzyme therapy") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/PreparingforDMKEnzymeTherapy.pdf";
        } else if (i.filename === "tca peel") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/TCAPeelPre.pdf";
        } else if (i.filename === "hydrafacial") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/HydraFacialPre.pdf";
        } else if (i.filename === "laser hair removal") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/LaserhairremovalPrepCare.pdf";
        } else if (
          i.filename === "rf body tightening" ||
          i.filename === "RFSkinTighteningPre.pdf"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/RFSkinTighteningPre.pdf";
        } else if (
          i.filename === "rf face contouring" ||
          i.filename === "rf body contouring" ||
          i.filename === "cellulite treatment" ||
          i.filename === "FaceandBodyContouringCelluliteReductionTreatmentCare"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Face+and+Body+Contouring%2CCellulite+Reduction+Treatment+Care.pdf";
        } else if (
          i.filename === "melasma (hormonal pigment) treatment" ||
          i.filename === "PreandPostCosmelanDepigmentationInstructions.pdf"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/PreandPostCosmelanDepigmentationInstructions.pdf";
        } else if (
          i.filename === "jetpeel facial" ||
          i.filename === "red carpet facial" ||
          i.filename === "JetPeelPreandPost.pdf"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/JetPeelPreandPost.pdf";
        } else if (i.filename === "laser skin resurfacing") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/ErbiumYag2940nmLaserSkinResurfacingPRE.pdf";
        } else if (
          i.filename === "ipl pigment treatment" ||
          i.filename === "acne" ||
          i.filename === "skin" ||
          i.filename === "ipl vascular (rosacea) treatment" ||
          i.filename === "ipl acne treatment" ||
          i.filename === "ipl skin rejuvanation"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/PreandPostTreatmentInstructionsforIPL.pdf";
        } else if (
          i.filename === "rf skin tightening" ||
          i.filename === "rfskin tightening" ||
          i.filename === "rf microneedling"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/PiXel8.pdf";
        } else if (i.filename === "neoskin rejuvenation") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Skin+Rejuvenation+(NeoSkin)+Pre+and+Post+Treatment+Care.pdf";
        } else if (
          i.filename === "acne scar revision by aerolase" ||
          i.filename === "scar revision by aerolase"
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Scar+Revision+Pre+and+Post+Treatment+Care.pdf";
        } else if (i.filename === "rosacea treatment by aerolase") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Rosacea+Pre+and+Post+Treatment+Care.pdf";
        } else if (i.filename === "neoclear by aerolase") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Acne+Removal+Pre+and+Post+Treatment+Care+(NeoClear).pdf";
        } else if (i.filename === "pigment reduction by aerolase") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PDF's/Pigmented+Lesion+Pre+and+Post+Treatment+Care.pdf";
        } else if (
          i.filename === "premium rejuvenated myer’s special" ||
          i.filename === "iv hydration now" ||
          i.filename === "super immunity boost" 
        ) {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/PreandPostVisitInstructions.pdf";
        }else if (i.filename === "exo-xom hair loss") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/shahina_1741332769015.pdf";
        } else if (i.filename === "laser body slimming") {
          url =
            "https://shahinaimage.s3.us-west-1.amazonaws.com/shahina_1741332823478.pdf";
        } 

        return (
          <div className="box" key={`pdf${index}`}>
            <p style={{ textTransform: "capitalize" }}> {i.filename} : </p>

            <a href={url} target="_blank" rel="noopener noreferrer">
              View pdf
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default PdfViewer;
