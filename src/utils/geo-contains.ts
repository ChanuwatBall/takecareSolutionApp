// utils/geo-contains.ts

// ชนิดข้อมูลเบื้องต้น (ไม่ต้องพึ่ง @types/geojson)
type LngLat = [number, number];          // [lng, lat]
type PolygonCoords = LngLat[];           // 1 ring
type PolygonRings = PolygonCoords[];     // [outer, hole1, hole2, ...]

// GeoJSON-like types
type PolygonGeom = { type: "Polygon"; coordinates: PolygonRings };
type MultiPolygonGeom = { type: "MultiPolygon"; coordinates: PolygonRings[] };
type Feature<G = PolygonGeom | MultiPolygonGeom, P = any> = {
  type: "Feature";
  geometry: G;
  properties?: P;
};
type GeoJSONPolygonLike = PolygonGeom | MultiPolygonGeom | Feature;

// ฟังก์ชันช่วย: ปิด ring ถ้าไม่ปิด
function ensureClosedRing(ring: PolygonCoords): PolygonCoords {
  if (ring.length === 0) return ring;
  const [fx, fy] = ring[0];
  const [lx, ly] = ring[ring.length - 1];
  if (fx === lx && fy === ly) return ring;
  return [...ring, [fx, fy]];
}

const EPS = 1e-9;

// แตะบนเส้น? (inclusive)
function isPointOnSegment(p: LngLat, a: LngLat, b: LngLat): boolean {
  // cross = 0 => colinear
  const cross =
    (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  if (Math.abs(cross) > EPS) return false;

  // อยู่ภายในช่วง AB หรือไม่ (เช็คด้วย dot)
  const dot =
    (p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1]);
  if (dot < -EPS) return false;

  const sqLen =
    (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
  if (dot - sqLen > EPS) return false;

  return true;
}

// ray casting บน 1 ring (รวม on-edge = true)
function pointInRing(p: LngLat, ringIn: PolygonCoords): boolean {
  const ring = ensureClosedRing(ringIn);
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j];
    const b = ring[i];

    // อยู่บนเส้นขอบ -> true
    if (isPointOnSegment(p, a, b)) return true;

    // ตัดกับ ray ทางขวา?
    const intersects =
      (a[1] > p[1]) !== (b[1] > p[1]) &&
      p[0] <
        ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1] + 0.0) + a[0];

    if (intersects) inside = !inside;
  }
  return inside;
}

// Polygon (มี holes): อยู่ใน outer และไม่อยู่ใน hole ใด ๆ
function pointInPolygon(p: LngLat, ringsIn: PolygonRings): boolean {
  if (!ringsIn || ringsIn.length === 0) return false;
  const outer = ringsIn[0];
  if (!pointInRing(p, outer)) return false;
  for (let i = 1; i < ringsIn.length; i++) {
    if (pointInRing(p, ringsIn[i])) return false; // inside a hole => outside
  }
  return true;
}

// entry: รองรับ Polygon / MultiPolygon / Feature
export function isLatLonInsideGeoJSON(
  lat: number,
  lon: number,
  geo: GeoJSONPolygonLike
): boolean {
  const point: LngLat = [lon, lat]; // แปลงเป็น [lng, lat]

  const geom =
    (geo as any).type === "Feature" ? (geo as Feature).geometry : (geo as any);

  if (!geom) return false;

  if (geom.type === "Polygon") {
    return pointInPolygon(point, geom.coordinates);
  }

  if (geom.type === "MultiPolygon") {
    // ถ้าอยู่ใน polygon ใด polygon หนึ่ง => true
    for (const rings of geom.coordinates) {
      if (pointInPolygon(point, rings)) return true;
    }
    return false;
  }

  // ไม่ใช่ polygon-like
  return false;
}

/* ---- ตัวช่วยสร้าง Feature จาก object เดิมของคุณ ---- */
export type AreaInput = {
  id: number;
  name: string;
  area: [number, number][]; // [lat, lon]
};

export function areaInputToFeature(
  data: AreaInput
): Feature<PolygonGeom, { id: number; name: string }> {
console.log("areaInputToFeature data ",data)
  const ringLngLat: LngLat[] = data.area.map(([lat, lon]) => [lon, lat]);
  const closed = ensureClosedRing(ringLngLat);
  return {
    type: "Feature",
    properties: { id: data.id, name: data.name },
    geometry: { type: "Polygon", coordinates: [closed] },
  };
}
