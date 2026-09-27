"""icoane_build.py — icoanele Fluent UI (Microsoft, MIT) pentru butoanele panglicii, puse DIRECT în panglica-<app>.json.

Harta idMso → numele icoanei Fluent e scrisă de mână (aspect, nu comandă: comenzile vin din aplicație).
Descărcare o dată de pe unpkg în fluent/ (cache + LICENSE), apoi fără internet: paginile nu depind de rețeaua
din laborator. O icoană care nu există în pachet se raportează; butonul ei rămâne cu eticheta scrisă.

  python _cercetare/office_comenzi/icoane_build.py excel
Ultima linie: numărul de icoane cerute și negăsite.
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

AICI = Path(__file__).resolve().parent
RAD = AICI.parents[1]
VERS = "1.1.343"
CACHE = AICI / "fluent"
HARTA = {  # idMso → icoană Fluent (20px, regular)
    "Paste": "clipboard_paste", "Cut": "cut", "Copy": "copy", "FormatPainter": "paint_brush",
    "FontSizeIncrease": "font_increase", "FontSizeDecrease": "font_decrease",
    "Bold": "text_bold", "Italic": "text_italic", "Underline": "text_underline",
    "BorderBottomNoToggle": "border_bottom", "CellFillColorPicker": "paint_bucket", "FontColorPicker": "text_color",
    "AlignTopExcel": "align_top", "AlignMiddleExcel": "align_center_vertical", "AlignBottomExcel": "align_bottom",
    "OrientationMenu": "text_direction_rotate_90_left", "AlignLeft": "text_align_left", "AlignCenter": "text_align_center",
    "AlignRight": "text_align_right", "IndentDecreaseExcel": "text_indent_decrease", "IndentIncreaseExcel": "text_indent_increase",
    "WrapText": "text_wrap", "MergeCenter": "table_cells_merge",
    "InternationalCurrency": "money", "CommaStyle": "number_symbol",
    "DecimalsIncrease": "arrow_up", "DecimalsDecrease": "arrow_down",
    "ConditionalFormattingMenu": "table_lightning", "FormatAsTableGallery": "table", "CellStylesGallery": "paint_brush",
    "CellsInsertSmart": "table_add", "CellsDeleteSmart": "table_delete_row", "FormatCellsMenu": "table_settings",
    "AutoSum": "autosum", "FillMenu": "arrow_down", "ClearMenu": "eraser", "SortFilterMenu": "arrow_sort", "SelectMenuExcel": "search",
    "TableInsertExcel": "table", "InsertPivotTableDropdown": "table_edit", "PivotTableSuggestion": "table_search",
    "FlyoutAnchorInsertPictures": "image", "ShapesInsertGallery": "shapes", "IconInsertFromFile": "icons",
    "ChartInsertGalleryNew": "chart_multiple", "ChartTypeColumnInsertGallery": "data_bar_vertical",
    "ChartTypeLineInsertGallery": "data_line", "ChartTypePieInsertGallery": "data_pie",
    "HyperlinkInsert": "link", "TextBoxInsertExcel": "textbox", "SymbolInsert": "math_symbols", "EquationInsertGallery": "math_formula",
    "PageMarginsGallery": "document_margins", "PageOrientationGallery": "document_landscape", "PageSizeGallery": "document",
    "FunctionWizard": "math_formula", "ShowFormulas": "math_formula",
    "SortAscendingExcel": "text_sort_ascending", "SortDescendingExcel": "text_sort_descending", "SortDialog": "arrow_sort",
    "Filter": "filter", "SortClear": "filter_dismiss", "RemoveDuplicates": "table_delete_column", "DataValidation": "checkmark_circle",
    "Spelling": "text_proofing_tools", "ReviewNewComment": "comment_add", "ReviewDeleteComment": "comment_dismiss",
    "ViewNormalViewExcel": "table", "ViewPageLayoutView": "document", "ViewFreezePanesGallery": "table_freeze_row",
    "ZoomDialog": "zoom_in", "ZoomCurrent100": "zoom_fit", "WindowNew": "window_new", "WindowSplitToggle": "split_horizontal",
    # Word + PowerPoint (27.09.2026)
    "FontSizeIncreaseWord": "font_increase", "FontSizeDecreaseWord": "font_decrease", "ClearFormatting": "text_clear_formatting",
    "ChangeCaseGallery": "text_case_title", "UnderlineGallery": "text_underline", "Strikethrough": "text_strikethrough",
    "Subscript": "text_subscript", "Superscript": "text_superscript", "TextEffectsGallery": "text_effects",
    "TextHighlightColorPicker": "highlight", "TextHighlightColorPickerLicensed": "highlight", "Shadow": "text_effects",
    "BulletsGalleryWord": "text_bullet_list_ltr", "BulletsGallery": "text_bullet_list_ltr",
    "NumberingGalleryWord": "text_number_list_ltr", "NumberingGallery": "text_number_list_ltr",
    "MultilevelListGallery": "text_bullet_list_tree", "IndentDecreaseWord": "text_indent_decrease",
    "IndentIncreaseWord": "text_indent_increase", "IndentDecrease": "text_indent_decrease", "IndentIncrease": "text_indent_increase",
    "SortDialogClassic": "text_sort_ascending", "ParagraphMarks": "text_paragraph", "AlignJustifyMenu": "text_align_justify",
    "LineSpacingGallery": "text_line_spacing", "LineSpacingGalleryPowerPoint": "text_line_spacing",
    "ShadingColorPicker": "paint_bucket", "BordersSelectionGallery": "border_bottom",
    "NavigationPaneFind": "search", "FindDialog": "search", "ReplaceDialog": "arrow_swap", "SelectMenu": "cursor",
    "CoverPageInsertGallery": "document", "BlankPageInsert": "document_add", "PageBreakInsertWord": "document_page_break",
    "TableInsertGallery": "table", "ChartInsert": "data_bar_vertical", "SmartArtInsert": "diagram",
    "HeaderInsertGallery": "document_header", "FooterInsertGallery": "document_footer",
    "HeaderFooterPageNumberInsert": "document_page_number", "TextBoxInsertGallery": "textbox", "TextBoxInsert": "textbox",
    "SymbolInsertGallery": "math_symbols", "PageColorPicker": "paint_bucket", "WatermarkGallery": "image",
    "TextWrapGallery": "text_wrap", "PicturePositionGallery": "position_to_front", "BreaksGallery": "document_page_break",
    "SpellingAndGrammar": "text_proofing_tools", "WordCount": "number_symbol", "ReadAloud": "read_aloud",
    "ReviewTrackChanges": "document_edit", "InsertNewComment": "comment_add",
    "ViewPrintLayoutView": "document", "ViewWebLayoutView": "globe", "ViewRulerWord": "ruler",
    "ZoomOnePage": "document_one_page", "ZoomPageWidth": "zoom_fit",
    "SlideNewGallery": "slide_add", "SlideNewGalleryInsert": "slide_add", "SlideLayoutGallery": "slide_layout",
    "SlideReset": "arrow_reset", "SectionMenu": "slide_multiple", "ShapeFillColorPicker": "paint_bucket",
    "OutlineColorPicker": "pen", "ObjectsArrangeMenu": "layer", "MovieInsert02": "video", "SoundInsertMenu02": "speaker_2",
    "SlideThemesGallery": "color", "SlideBackgroundStylesGallery": "image", "PowerPointPageSetup": "slide_size",
    "TransitionPreview": "play", "AnimationPreview": "play", "EffectOptionsMenu": "options",
    "AnimationAddGallery": "sparkle", "AnimationCustom": "list", "AnimationPainter": "paint_brush",
    "SlideTransitionApplyToAll": "select_all_on", "SlideShowFromCurrent": "slide_play",
    "SlideShowSetUpDialog": "settings", "HideSlide": "slide_hide", "ViewSlideSorterView": "grid",
    "ViewNotesPageView": "notepad", "ViewSlideMasterView": "slide_layout", "ShowNotes": "notepad",
    "ZoomFitToWindow": "zoom_fit",
}
RE_PATH = re.compile(r"<path\b[^>]*\bd=\"([^\"]+)\"", re.I)


def icoana(nume: str) -> list[str] | None:
    CACHE.mkdir(exist_ok=True)
    f = CACHE / f"{nume}_20_regular.svg"
    if not f.exists():
        url = f"https://unpkg.com/@fluentui/svg-icons@{VERS}/icons/{nume}_20_regular.svg"
        try:
            f.write_bytes(urllib.request.urlopen(url, timeout=20).read())
        except Exception:  # noqa: BLE001
            return None
    return RE_PATH.findall(f.read_text(encoding="utf-8")) or None


def main() -> int:
    app = sys.argv[1] if len(sys.argv) > 1 else "excel"
    lic = CACHE / "LICENSE"
    if not lic.exists():
        CACHE.mkdir(exist_ok=True)
        try:
            lic.write_bytes(urllib.request.urlopen(f"https://unpkg.com/@fluentui/svg-icons@{VERS}/LICENSE", timeout=20).read())
        except Exception:  # noqa: BLE001
            lic.write_text("MIT License — @fluentui/svg-icons (Microsoft). https://github.com/microsoft/fluentui-system-icons\n", encoding="utf-8")
    p = RAD / "jocuri" / "_motor" / f"panglica-{app}.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    ids = {b["id"] for f in d["file"] for g in f["grupuri"] for b in g["butoane"]}
    icoane, lipsa = {}, []
    for idm in sorted(ids & HARTA.keys()):
        cai = icoana(HARTA[idm])
        if cai:
            icoane[idm] = cai
        else:
            lipsa.append(f"{idm} → {HARTA[idm]}")
    d["icoane"] = icoane
    d["_icoane"] = f"Fluent UI System Icons @fluentui/svg-icons {VERS} (MIT, Microsoft), 20px regular; viewBox 0 0 20 20. Licența: _cercetare/office_comenzi/fluent/LICENSE"
    p.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    # varianta pentru pagină: un <script> merge și din file:// (poarta), unde fetch() pe JSON nu merge
    p.with_suffix(".js").write_text(
        f"/* GENERAT de _cercetare/office_comenzi/panglica_build.py + icoane_build.py - nu edita de mână. */\n"
        f"window.PANGLICA_{app.upper()} = " + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"icoane: {len(icoane)} din {len(ids & HARTA.keys())} cerute (butoane în panglică: {len(ids)})")
    for l in lipsa:
        print("  negăsită:", l)
    print(len(lipsa))
    return 0


if __name__ == "__main__":
    sys.exit(main())
