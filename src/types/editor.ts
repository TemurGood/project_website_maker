export interface BlockStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: string; // например: "16px", "24px", "32px"
  fontWeight?: string; // "400", "600", "700"
  textAlign?: "left" | "center" | "right";
  paddingTop?: number; // в px
  paddingBottom?: number;
  marginTop?: number;
  marginBottom?: number;
  borderRadius?: number; // в px
  borderWidth?: number;
  borderColor?: string;
}

export type BlockType = "heading" | "paragraph" | "image" | "button" | "quote";

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: {
    text?: string;
    level?: "h1" | "h2" | "h3";
    url?: string;
    alt?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  styles: BlockStyle;
}