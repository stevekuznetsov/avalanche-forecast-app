// MapLayer describes forecast zones to be drawn for an avalanche center
export interface MapLayer {
  type: string; // TODO(skuznets): is this ever something other than 'FeatureCollection'?
  features: Feature[];

  // TODO(skuznets): the following fields exist in the response but are never set, no idea if they are useful or what their type is
  // start_time: string;
  // end_time: string;
}

// Feature is a representation of a forecast zone
export interface Feature {
  type: string; // TODO(skuznets): is this ever something other than 'Feature'?
  id: number;
  properties: FeatureProperties;
  geometry: FeatureComponent;
}

// FeatureProperties contains three types of metadata about the forecast zone:
// - static information like the name of the zone and timezone
// - dynamic information like the current forecast and travel advice
// - consumer directions for how to render the feature, like fill color & stroke
export interface FeatureProperties {
  name: string;
  center: string;
  center_link: string;
  state: string;
  link: string;

  off_season: boolean;
  travel_advice: string;

  danger: string;
  danger_level: DangerLevel;
  // start_date and end_date are RFC3339 timestamps that bound the current forecast
  start_date: string;
  end_date: string;

  warning: Warning;

  color: string; // TODO(skuznets): encode that this is a hex color in the type?
  stroke: string; // TODO(skuznets): encode that this is a hex color in the type?
  font_color: string; // TODO(skuznets): encode that this is a hex color in the type?
  fillOpacity: number;
  fillIncrement: number;
}

enum DangerLevel {
  GeneralInformation = -1,
  None,
  Low,
  Moderate,
  Considerable,
  High,
  Extreme,
}

export interface FeatureComponent {
  type: string;
  // coordinates encodes a list of points, each as a two-member array [longitude,latitude]
  // for a type=Polygon, this a three-dimensional array number[][][]
  // for a type=MultiPolygon, this a four-dimensional array number[][][][]
  coordinates: any;
}

export interface Warning {
  product: Product;
}

export interface Product {}
