import dynamic from 'next/dynamic'
import React from 'react'
import dataGermany from '../../data/geoJson/germany-states.json'
import dataFrance from '../../data/geoJson/france-states.json'
import dataBelgium from '../../data/geoJson/belgium-states.json'
import dataItaly from '../../data/geoJson/italy-states.json'
import { GeoJsonObject } from 'geojson'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  country: string,
  stateNames: Map<string, { url: string, name: string }>,
}

const CountryMapContainer = ({ country, stateNames }: Props) => {

  const { lang } = useTranslation();

  let data = undefined;
  let coordinates = { lat: 0, lng: 0 };
  let zoom = 6;

  if (country === "germany") {
    data = dataGermany as GeoJsonObject;
    coordinates = { lat: 51.381, lng: 11.008 };
    zoom = 6;

  } else if (country === "france") {
    data = dataFrance as GeoJsonObject;
    coordinates = { lat: 46.89, lng: 2.813 };
    zoom = 6;

  } else if (country === "italy") {
    data = dataItaly as GeoJsonObject;
    coordinates = { lat: 42.137, lng: 13.348 };
    zoom = 6;

  } else if (country === "belgium") {
    data = dataBelgium as GeoJsonObject;
    coordinates = { lat: 50.52, lng: 4.633 };
    zoom = 8;

  }

  const Map = React.useMemo(() => dynamic(
    () => import('../dynamic/CountryMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false // prevent server-side render
    }
  ), [lang]);

  if (data === undefined) {
    return <></>;
  }

  return <Map
    country={country}
    stateNames={stateNames}
    data={data}
    coordinates={coordinates}
    zoomLevel={zoom}
  />

}

export default CountryMapContainer