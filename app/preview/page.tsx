import { renderWeddingTemplate } from "@/lib/template-registry";
import { demoWedding } from "@/lib/wedding-data";

export default function WeddingPreview() {
  return renderWeddingTemplate("romantic", demoWedding, "/");
}