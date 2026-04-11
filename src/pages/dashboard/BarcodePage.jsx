import { Barcode, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getInventory } from "../../services/InventoryService";

/*
  BarcodePage
  ─────────────────────────────────────────────────────────────────────────────
  PURPOSE:
    Lets staff scan or type a product barcode to instantly look up its details
    and current stock level.

  HOW IT WORKS:
    1. On mount, fetches all inventory via getInventory() → stores in `catalog`.
    2. The search input is auto-focused so a barcode scanner (USB HID) can type
       into it the moment the page loads (scanners act as keyboards).
    3. As the user types / scanner outputs characters, we filter `catalog`
       client-side by `product_barcode`.
    4. If exactly one match is found it's highlighted as the "active" result.

  BARCODE SCANNERS (USB HID):
    - Plug in the scanner. It behaves like a keyboard — no drivers needed.
    - When the cashier scans an item, the scanner types the barcode string then
      sends an Enter key. The `onKeyDown` handler on the input detects Enter
      and calls handleSearch() to lock in the match.
    - For multi-line scanning sessions, pressing Escape clears the query and
      moves focus back to the input.

  DATA SOURCE:
    GET /api/inventory/displayAll
    The inventory DTO includes `product_barcode` (a string, e.g. "123456789").
    If a product has no barcode the field is null — those rows are excluded from
    barcode search results.

  NOTE — no separate barcode endpoint:
    There is no GET /api/products/byBarcode endpoint yet. We load all inventory
    once and filter client-side. For large catalogs (10,000+ SKUs), replace
    this with a debounced server call:
      GET /api/inventory/byBarcode?code={query}
  ─────────────────────────────────────────────────────────────────────────────
*/

// ── Barcode visual renderer ─────────────────────────────────────────────────
// Renders a simple CSS-only barcode-style visual using vertical bars.
// This is decorative — it does not encode the actual number into real bars.
// For a real barcode image, use a library like `jsbarcode` or `bwip-js`.
const BarcodeSVG = ({ value }) => {
  if (!value) return null;

  // Deterministically map each character to a bar pattern.
  // Each digit in the barcode string maps to a thin/thick bar pair.
  // This creates a visually distinct pattern per barcode without a real encoder.
  const bars = value.split("").flatMap((char) => {
    const n = char.charCodeAt(0) % 9;          // 0–8
    const thick = n > 4;                        // top half = thick, bottom = thin
    return [
      { width: thick ? 3 : 1.5, gap: 1 },
      { width: 1, gap: n % 3 === 0 ? 2 : 1 },
    ];
  });

  const totalWidth = bars.reduce((acc, b) => acc + b.width + b.gap, 0);
  const height = 60;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      className="w-full max-w-xs h-16"
      aria-label={`Barcode for ${value}`}
    >
      {/* Bars */}
      {bars.reduce((acc, bar) => {
        const x = acc.x;
        acc.elements.push(
          <rect key={acc.elements.length} x={x} y={0} width={bar.width} height={height} fill="#1a1a1a" />
        );
        acc.x += bar.width + bar.gap;
        return acc;
      }, { x: 0, elements: [] }).elements}

      {/* Value text beneath bars */}
      <text
        x={totalWidth / 2}
        y={height - 2}
        textAnchor="middle"
        fontSize="5"
        fill="#555"
        fontFamily="monospace"
      >
        {value}
      </text>
    </svg>
  );
};

// ── Product card — shown when a match is found ───────────────────────────────
const ProductCard = ({ item }) => (
  <div className="bg-custom-white border border-custom-gray-2 rounded-2xl p-6 shadow-sm animate-fade-in">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-xs text-custom-gray font-medium">{item.productDisplayId}</p>
        <h2 className="text-2xl font-extrabold text-custom-black mt-0.5">{item.productName}</h2>
      </div>
      <Badge
        variant="outline"
        className={`text-xs mt-1 ${
          item.productGender?.toLowerCase() === "male"
            ? "border-custom-blue text-custom-blue"
            : item.productGender?.toLowerCase() === "female"
            ? "border-custom-purple text-custom-purple"
            : "border-custom-green text-custom-green"
        }`}
      >
        {item.productGender || "Unisex"}
      </Badge>
    </div>

    {/* Barcode visual */}
    <div className="bg-custom-gray-2/50 rounded-xl p-4 flex flex-col items-center gap-2 mb-6">
      <BarcodeSVG value={item.productBarcode} />
      <p className="text-xs font-mono text-custom-gray tracking-widest">{item.productBarcode}</p>
    </div>

    {/* Details grid */}
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs text-custom-gray font-medium">Type</p>
        <p className="font-semibold text-custom-black mt-0.5">{item.productType || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-custom-gray font-medium">Note</p>
        <p className="font-semibold text-custom-black mt-0.5">{item.productNote || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-custom-gray font-medium">Branch</p>
        <p className="font-semibold text-custom-black mt-0.5">{item.branchDisplayId || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-custom-gray font-medium">Current Stock</p>
        <p className={`font-extrabold text-xl mt-0.5 ${
          item.productQuantity <= 5 ? "text-custom-red" : "text-custom-green"
        }`}>
          {item.productQuantity}
          {item.productQuantity <= 5 && (
            <span className="text-xs font-normal ml-2 text-custom-red">⚠ Low stock</span>
          )}
        </p>
      </div>
    </div>
  </div>
);

// ── Main page ───────────────────────────────────────────────────────────────
const BarcodePage = () => {
  const [catalog,    setCatalog]    = useState([]);   // all inventory rows with a barcode
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState(null);
  const [query,      setQuery]      = useState("");   // barcode input value
  const [matches,    setMatches]    = useState([]);   // rows matching current query
  const [lockedItem, setLockedItem] = useState(null); // item locked in after Enter / exact match

  // inputRef so we can auto-focus and re-focus after a scan
  const inputRef = useRef(null);

  // ── Load all inventory on mount ─────────────────────────────────────────
  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInventory();
      // Only keep rows that have a barcode — null barcode rows are not scannable
      const withBarcode = data.filter((row) => row.productBarcode);
      setCatalog(withBarcode);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      // Focus the input so scanner output lands here immediately
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  // ── Live filter as query changes ────────────────────────────────────────
  // We search by productBarcode (exact prefix match) and also by product name
  // so staff can type a partial name if they don't have a scanner.
  useEffect(() => {
    if (!query.trim()) {
      setMatches([]);
      setLockedItem(null);
      return;
    }
    const q = query.trim().toLowerCase();
    const found = catalog.filter(
      (row) =>
        row.productBarcode?.toLowerCase().startsWith(q) ||
        row.productName?.toLowerCase().includes(q)
    );
    setMatches(found);

    // Auto-lock if there's exactly one match (common for scanner — unique barcodes)
    if (found.length === 1) {
      setLockedItem(found[0]);
    } else {
      setLockedItem(null);
    }
  }, [query, catalog]);

  // ── Keyboard handler ─────────────────────────────────────────────────────
  // Enter key = commit to the first match (scanner sends Enter after barcode string)
  // Escape key = clear query and refocus for next scan
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && matches.length > 0) {
      setLockedItem(matches[0]);
    }
    if (e.key === "Escape") {
      clearSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setMatches([]);
    setLockedItem(null);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-1">
        <Barcode size={28} className="text-custom-black" />
        <div>
          <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none">
            Barcode Lookup
          </h1>
          <p className="text-custom-gray text-sm mt-1">
            Scan or type a barcode to look up a product
          </p>
        </div>
      </div>

      {/* ── SCANNER INPUT ───────────────────────────────────────────────── */}
      {/*
        This input is deliberately large so the cursor is clearly visible.
        A USB barcode scanner (HID mode) will type into this field and press
        Enter automatically. No other UI action is required from the user.
      */}
      <div className="relative mt-8 mb-6">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-gray pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scan barcode or type product name…"
          autoComplete="off"
          spellCheck={false}
          className="w-full border-2 border-custom-gray-2 focus:border-custom-primary rounded-xl pl-12 pr-12 py-4 text-lg text-custom-black outline-none transition-colors font-mono tracking-wider placeholder:font-sans placeholder:tracking-normal"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-custom-gray hover:text-custom-black"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── KEYBOARD HINTS ──────────────────────────────────────────────── */}
      <div className="flex gap-4 mb-6 text-xs text-custom-gray">
        <span><kbd className="bg-custom-gray-2 px-1.5 py-0.5 rounded font-mono">Enter</kbd> to select first match</span>
        <span><kbd className="bg-custom-gray-2 px-1.5 py-0.5 rounded font-mono">Esc</kbd> to clear</span>
      </div>

      {/* ── ERROR ───────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-custom-red">
          {error} — <button onClick={loadCatalog} className="underline">retry</button>
        </div>
      )}

      {/* ── LOADING ─────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 gap-3 text-custom-gray">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-custom-gray border-t-custom-black" />
          <span className="text-sm">Loading product catalog…</span>
        </div>
      )}

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 flex-1">

          {/* LEFT: match list or idle state */}
          <div>
            {/* Idle state — nothing typed yet */}
            {!query && (
              <div className="flex flex-col items-center justify-center py-20 text-custom-gray gap-4">
                <Barcode size={56} className="opacity-20" />
                <p className="text-sm font-medium">
                  {catalog.length > 0
                    ? `${catalog.length} barcoded products loaded. Ready to scan.`
                    : "No barcoded products found in inventory."}
                </p>
              </div>
            )}

            {/* No matches */}
            {query && matches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-custom-gray gap-4">
                <Search size={40} className="opacity-20" />
                <p className="text-sm font-medium">No product found for "{query}"</p>
                <p className="text-xs">Check the barcode or try searching by product name</p>
              </div>
            )}

            {/* Match list — shown when there are multiple matches */}
            {matches.length > 1 && (
              <div className="space-y-2">
                <p className="text-xs text-custom-gray font-medium mb-3">
                  {matches.length} products matched — click one to select
                </p>
                {matches.map((item, index) => (
                  <button
                    key={item.inventoryDisplayId ?? index}
                    onClick={() => setLockedItem(item)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors text-left ${
                      lockedItem?.inventoryDisplayId === item.inventoryDisplayId
                        ? "border-custom-primary bg-custom-primary/20"
                        : "border-custom-gray-2 bg-custom-white hover:bg-custom-primary/10"
                    }`}
                  >
                    <Barcode size={20} className="text-custom-gray shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-custom-black text-sm truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-custom-gray font-mono">{item.productBarcode}</p>
                    </div>
                    <span className={`text-sm font-bold ${
                      item.productQuantity <= 5 ? "text-custom-red" : "text-custom-green"
                    }`}>
                      {item.productQuantity} in stock
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Single exact match — show immediately (scanner use case) */}
            {matches.length === 1 && <ProductCard item={matches[0]} />}
          </div>

          {/* RIGHT: locked item detail card */}
          <div>
            {lockedItem && matches.length > 1 && (
              <>
                <p className="text-xs text-custom-gray font-medium mb-3">Selected:</p>
                <ProductCard item={lockedItem} />
              </>
            )}

            {/* Tips panel when idle */}
            {!lockedItem && !query && (
              <div className="bg-custom-white border border-custom-gray-2 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-custom-black mb-3">Scanner Tips</h3>
                <ul className="space-y-2 text-xs text-custom-gray list-disc list-inside">
                  <li>Connect a USB HID barcode scanner</li>
                  <li>This page auto-focuses the input on load</li>
                  <li>The scanner acts as a keyboard — no drivers needed</li>
                  <li>Most scanners send Enter after the barcode string</li>
                  <li>Press <kbd className="bg-custom-gray-2 px-1 py-0.5 rounded font-mono">Esc</kbd> to clear for the next scan</li>
                  <li>You can also type a product name manually</li>
                </ul>

                <div className="mt-4 pt-4 border-t border-custom-gray-2">
                  <p className="text-xs text-custom-gray">
                    <strong className="text-custom-black">Catalog loaded:</strong>{" "}
                    {catalog.length} barcoded items
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodePage;
