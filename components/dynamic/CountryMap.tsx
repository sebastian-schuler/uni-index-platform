import React from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import hash from 'object-hash';
import { GeoJsonObject } from 'geojson'
import useTranslation from 'next-translate/useTranslation';
import labelPositioning from '../../data/geoJson/labelPositioning';

type Props = {
    country: string,
    stateNames: Map<string, { url: string, name: string }>,
    data: GeoJsonObject,
    coordinates: { lat: number, lng: number },
    zoomLevel: number
}

const CountryMap = ({ country, stateNames, data, coordinates, zoomLevel }: Props) => {

    const { t, lang } = useTranslation('common');
    const langContent = {
    }

    function onEachFeature(feature: any, layer: L.Layer) {
        if (feature.properties) {
            const { id } = feature.properties;

            const url = stateNames.get(id)?.url;
            const name = stateNames.get(id)?.name;

            // Area is clicked
            layer.addEventListener("click", (e) => {
                window.location.href = `/location/${country}/${url}`;
            })

            const labelPosition = labelPositioning.get(id);
            if (labelPosition !== undefined) {
                layer.bindTooltip(`<a class="p-1" href="/location/${country}/${url}">${name}</>`,
                    { permanent: true, direction: labelPosition.direction, interactive: true, offset: labelPosition.offset }
                );
            } else {
                layer.bindTooltip(`<a class="p-1" href="/location/${country}/${url}">${name}</>`,
                    { permanent: true, direction: "bottom", interactive: true, }
                );
            }

        }
    }

    return (
        <div className='h-[600px] w-full'>

            <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={zoomLevel} scrollWheelZoom={false} style={{ height: 600, width: "100%", zIndex: 5 }} >
                {/* <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> */}
                <GeoJSON key={hash(data)} data={data} onEachFeature={onEachFeature} interactive={true} />
            </MapContainer>

        </div>
    )
}

export default CountryMap