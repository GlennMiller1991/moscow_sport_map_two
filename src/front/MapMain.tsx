import * as React from 'react';
import EventEmitter from 'events';
import sport_objects_district from './mock/sport_objects_district.json';
import hull from 'hull.js';
import arrow from './../front/Tilda_Icons_22_Sport/arrow.png'

import {getInterjacentColorStr, IDistrict, IObj, IRGBA} from '../mid/misc/types';

import {
    spr_affinity,
    spr_sport,
    spr_zonetype
} from './mock/sprs';
import {getSportStats, isInMoscow} from '../mid/misc/helpers';
import {distanceLatLng} from '../mid/lib/geom';
import {shadowScreen, unshadowScreen} from './funcBro';
import {array_unique} from '../mid/lib/func';
import {createFactory, useCallback, useEffect, useRef, useState} from "react";

async function calcNet(objs: IObj[]) {
    const GRID_SIZE_LAT = 100;
    const GRID_SIZE_LNG = GRID_SIZE_LAT;
    const STEP_LAT = -0.01; // ~ 1000 м
    const STEP_LNG = -STEP_LAT * 2; // ~ 1000 м
    const LAT0 = 56;
    const LNG0 = 36;

    const radii = [5000, 3000, 1000, 500];

    let t0 = Date.now();
    let arr_cover = [];

    let lng, lat;
    let isFirst = true;

    for (let i = 0; i < GRID_SIZE_LAT; i++) {
        lat = LAT0 + STEP_LAT * i;

        // console.log(i);

        for (let j = 0; j < GRID_SIZE_LNG; j++) {
            lng = LNG0 + STEP_LNG * j;

            if (!isInMoscow([lat, lng])) {
                continue;
            }

            let raw = [];
            let cur_cover = {
                lat,
                lng,
                qty: 0
            };

            objs.forEach((obj) => {
                let d = distanceLatLng(
                    [lat, lng],
                    [obj.lat, obj.lng]
                );

                raw.push({
                    d: d,
                    lat,
                    lng,
                    id: obj.id,
                });

                let radius = obj.affinityId ? radii[obj.affinityId - 1] : null;

                if (radius && (d <= radius)) {
                    cur_cover.qty += 1;
                }
            });

            arr_cover.push(cur_cover);

            isFirst = false;
        }

        // arr_cover = [];
    }

    let t1 = Date.now();

    return arr_cover;
}

async function getNet(objs: IObj[]) {
    let max = 0;
    const stepCount = 10;

    const rgb1 = [255, 0, 0, 1] as IRGBA;
    const rgb2 = [0, 255, 0, 1] as IRGBA;

    // net_1000m
    let net = await calcNet(objs);

    net.forEach((row) => {
        if (row.qty > max) {
            max = row.qty;
        }
    });

    max++;

    let res = [];
    net.forEach((row) => {
        let step = Math.floor(row.qty / max * stepCount);
        let color = getInterjacentColorStr(step, stepCount, rgb1, rgb2);

        res.push({...row, color});
    });

    return res;
}

function getColorBySquare(square) {
    let step;

    if (square && Math.log10(square) > 1) {
        step = Math.floor(Math.log10(square));
    } else {
        step = 1;
    }

    const stepCount = 14;

    const rgb1 = [255, 0, 0, 1] as IRGBA;
    const rgb2 = [0, 255, 0, 1] as IRGBA;

    return getInterjacentColorStr(step, stepCount, rgb1, rgb2);
}

const DG = require('2gis-maps');

interface IMapMainProps {
    objs: IObj[],
    emitter: EventEmitter,
    isPopulationLayer?: boolean,
    isCoverNet?: boolean,
    isAvailOnClick?: boolean,
    districts: IDistrict[],
    sportId?: number
}

interface IMapMainState {
}

const clusterParams = {
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    disableClusteringAtZoom: 18
}

export default class MapMain extends React.Component<IMapMainProps, IMapMainState> {
    map;
    cluster;

    circles = [];
    polys = [];

    nearestMarkers = [];
    intersectPoly;

    prevProps;

    constructor(props) {
        super(props);

        this.state = {}
        props.emitter.on('clearCircles', () => {
            debugger
            this.circles.forEach(circle => {
                circle.removeFrom(this.map);
            })

            this.circles = [];
        });
    }

    // form html layout on popup
    formPopupInnerHTML(obj: IObj) {
        let affinityName = spr_affinity[obj.affinityId];

        let res = `
            <div class="popup" title="id: ${obj.id}">
                <!-- div class="fieldCont">
                    ${obj.lat} - ${obj.lng}
                </div -->
                <div class="fieldCont">
                    <div class="label">Наименование спортивного объекта</div>
                    <div class="value">${obj.name}</div>
                </div>
                <div class="fieldCont">
                    <div class="label">Ведомственная принадлежность</div>
                    <div class="value">${obj.org || '-'}</div>
                </div>
                <div class="fieldCont">
                    <div class="label">Общая площадь, кв.м.</div>
                    <div class="value">${obj.square || '-'}</div>
                </div>
                <div class="section">`;

        obj?.parts.forEach((part, i) => {
            let zonetypeName = spr_zonetype[part.sportzonetypeId];

            if (i) {
                res += `<div class="preborder"></div>`;
            }

            res +=
                `
                    <div class="fieldCont">
                        <div class="label">Спортивная зона ${i + 1}</div>
                        <div class="value">${part.sportzone}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Тип</div>
                        <div class="value">${zonetypeName || '-'}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Площадь, кв.м.</div>
                        <div class="value">${part.square || '-'}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Виды спорта</div>
                        <div class="sports">
                            ${part.roles.map((sportId) => `<div class="value">${spr_sport[sportId]}</div>`).join('\n')}
                        </div>
                    </div>
                `;

        });

        res += `
            </div>
            <div class="fieldCont">
                    <div class="label">Доступность</div>
                    <div class="value">${affinityName}</div>
                </div>
            </div>
        `;

        return res;
    }

    shouldComponentUpdate() {
        this.prevProps = this.props;
        return true;
    }

    removeObjectsFromMap() {
        this.circles.forEach(circle => {
            setTimeout(() => {
                circle.removeFrom(this.map);
            }, 0)
        })
        this.circles = [];

        this.nearestMarkers.forEach(marker => {
            setTimeout(() => {
                marker.removeFrom(this.map);
            }, 0)
        });
        this.nearestMarkers = [];

        if (this.intersectPoly) {
            this.intersectPoly.removeFrom(this.map);
        }
    }

    setMyMarkerOnMap(event: any) {
        let myIcon = DG.icon({
            iconUrl: arrow,
            iconSize: [30, 30]
        });
        let latlng = [event.latlng.lat, event.latlng.lng]
        let marker = DG.marker([...latlng], {icon: myIcon, opacity: 0.6}).addTo(this.map);
        let popupContent = '';
        // Why is this here?
        marker.bindPopup(popupContent);
        this.nearestMarkers.push(marker);
    }

    getZoneInfo(objsFound) {
        let sumSquare = 0;
        let zoneTypeIds = [];
        let sportIds = [];

        objsFound.forEach((obj) => {
            sumSquare += obj.square;

            obj.parts.forEach(part => {
                zoneTypeIds.push(part.sportzonetypeId);
                sportIds = sportIds.concat(part.roles);
            })
        });

        zoneTypeIds = array_unique(zoneTypeIds);
        sportIds = array_unique(sportIds);

        let zoneTypes = zoneTypeIds.map(id => spr_zonetype[id]);
        let sports = sportIds.map(id => spr_sport[id]);

        let rgbStr = getColorBySquare(sumSquare);
        return {zoneTypes, sports, rgbStr, sumSquare}
    }

    nearestObj(event: any) {
        let minLat = +Infinity;
        let minLng = +Infinity;
        let maxLat = 0;
        let maxLng = 0;
        let objsFound: Array<IObj & { radius: number }> = [];

        this.props.objs.forEach((obj, pos) => {

            const distance = this.map.distance(event.latlng, {
                lat: obj.lat,
                lng: obj.lng,
            })

            let radii = [5000, 3000, 1000, 500];
            let radius = radii[obj.affinityId - 1];

            if (distance <= radius) {
                setTimeout(() => {
                    let marker = DG.marker({lat: obj.lat, lng: obj.lng}).addTo(this.map);

                    let popupContent = this.formPopupInnerHTML(obj);
                    marker.bindPopup(popupContent);

                    let radii = [5000, 3000, 1000, 500];
                    let radius = radii[obj.affinityId - 1];

                    let rgbStr = getColorBySquare(obj.square);
                    marker.on('click', () => {
                        let circle = DG.circle([obj.lat, obj.lng], {radius, color: rgbStr}).addTo(this.map);
                        circle.square = obj.square;

                        this.circles.push(circle);
                    });

                    this.nearestMarkers.push(marker);
                    objsFound.push({...obj, radius})

                    if (obj.lat < minLat) {
                        minLat = obj.lat;
                    }
                    if (obj.lat > maxLat) {
                        maxLat = obj.lat;
                    }
                    if (obj.lng < minLng) {
                        minLng = obj.lng;
                    }
                    if (obj.lng > maxLng) {
                        maxLng = obj.lng;
                    }
                }, 0)
            }
        });

        // looking for zones with max
        // access convenience
        setTimeout(() => {
            let amendLat = 0.05;
            let amendLng = 0.05 * 2;

            let startLat = minLat - amendLat;
            let startLng = minLng - amendLng;
            if (objsFound.length) {
                const STEP_LAT = 0.0001; // ~ 10 м
                const STEP_LNG = STEP_LAT * 2; // ~ 100 м

                let i = 0;
                let lat;
                let lng;

                let points = [];
                do {
                    let j = 0;

                    do {
                        lat = startLat + i * STEP_LAT;
                        lng = startLng + j * STEP_LNG;

                        // for each obj in found objs calculate
                        // distance between current latlng. Why?
                        // If dist-e greater then obj radius
                        // then isIn turn on false and break loop
                        // only when all objs in accessing point go to array
                        let isIn = true;
                        for (let k = 0; k < objsFound.length; k++) {
                            let d = this.map.distance(
                                {
                                    lat: objsFound[k].lat,
                                    lng: objsFound[k].lng
                                },
                                {
                                    lat,
                                    lng
                                }
                            );

                            if (d > objsFound[k].radius) {
                                isIn = false;
                                break;
                            }
                        }

                        // if isIn true push point to points
                        if (isIn) {
                            points.push([lat, lng]);
                        }

                        j += 1;
                    } while (lng <= maxLng + amendLng);

                    i += 1;
                } while (lat <= maxLat + amendLat);

                if (points.length) {

                    let coords = hull(points);

                    let zoneRes = this.getZoneInfo(objsFound)
                    this.intersectPoly = DG.polygon(coords, {color: zoneRes.rgbStr}).addTo(this.map);

                    let popupContent =
                        `
                <div class="popup">
                    <div class="fieldCont">
                        Находится в зоне доступности для кол-ва объектов: '+ ${objsFound.length}
                    </div>
                    <div class="fieldCont">
                        Суммарная площадь: '+ ${zoneRes.sumSquare || '-'}
                    </div>
                    <div class="fieldCont">
                        <div class="label">Типы спорт. зон</div>
                        <div class="sports">
                            ${zoneRes.zoneTypes.map((name) => `<div class="value">${name}</div>`).join('\n')}
                        </div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Виды спорта</div>
                        <div class="sports">
                            ${zoneRes.sports.map((name) => `<div class="value">${name}</div>`).join('\n')}
                        </div>
                    </div>
                </div>
                `;

                    this.intersectPoly.bindPopup(popupContent);
                }
            }
        })
    }

    render() {
        console.log('from main')
        return (
            <>
                <div
                    id="map"
                    style={{width: '100%', height: '100%'}}
                    ref={(node) => {
                        if (node) {
                            // Question??
                            // onClick - if avail -> get
                            // why not avail ? onclick : nothing
                            if (!this.map) {

                                this.map = DG.map('map', {
                                    'center': [55.754753, 37.620861],
                                    'zoom': 11
                                });

                                this.map.on('click', (event) => {

                                    // if analyze on click then get nearest objects
                                    if (this.props.isAvailOnClick) {
                                        this.removeObjectsFromMap()
                                        this.setMyMarkerOnMap(event)
                                        this.nearestObj(event);
                                    }
                                })
                            }

                            // onClick remove previous layer and get new cluster with leaflet
                            // on each new obj get html layout and bind it to click on obj
                            if (this.props.isAvailOnClick) {
                                if (this.cluster) {
                                    this.map.removeLayer(this.cluster);
                                }

                                this.circles.forEach(circle => {
                                    circle.removeFrom(this.map);
                                })

                            } else {
                                if (this.prevProps?.objs !== this.props.objs) {
                                    if (this.cluster) {
                                        this.map.removeLayer(this.cluster);
                                    }

                                    let cluster = DG.markerClusterGroup(clusterParams);

                                    this.props.objs.forEach(obj => {
                                        let popupContent = this.formPopupInnerHTML(obj);

                                        let marker = DG.marker(obj);
                                        marker.bindPopup(popupContent);

                                        cluster.addLayer(marker);
                                        let that = this;

                                        let radii = [5000, 3000, 1000, 500];
                                        let radius = radii[obj.affinityId - 1];

                                        let rgbStr = getColorBySquare(obj.square);
                                        marker.on('click', function () {
                                            let circle = DG.circle([obj.lat, obj.lng], {
                                                radius,
                                                color: rgbStr
                                            }).addTo(that.map);
                                            circle.square = obj.square;

                                            that.circles.push(circle);
                                        });
                                    });

                                    this.map.addLayer(cluster);
                                    this.cluster = cluster;
                                }

                                // Question???
                                // shit structure: delete layer if was changed but then check if need
                                // color depends on population layer, then get html layout and draw it
                                if (this.prevProps?.isPopulationLayer !== this.props.isPopulationLayer) {
                                    this.polys.forEach((poly) => {
                                        poly.removeFrom(this.map);
                                    });

                                    if (this.props.isPopulationLayer) {
                                        this.props.districts.forEach((district, i) => {
                                            const limit = 20;

                                            let dense = Math.floor(district.population / district.square / 10);
                                            if (dense > limit) {
                                                dense = limit;
                                            }

                                            const rgb1 = [0, 0, 255, 1] as IRGBA;
                                            const rgb2 = [255, 0, 0, 1] as IRGBA;

                                            let rgbStr = getInterjacentColorStr(dense, limit, rgb1, rgb2);

                                            let poly;
                                            if (1) { // district.coords.length > 1
                                                poly = DG.polygon(district.coords, {color: rgbStr}).addTo(this.map);

                                                let {
                                                    countSpecific,
                                                    sumSpecific,
                                                    countRolesSpecific
                                                } = getSportStats(this.props.objs, this.props.districts, sport_objects_district, i);

                                                // title="id: ${obj.id}"
                                                let text =
                                                    `
                                            <div class="popup">
                                                <div class="fieldCont">
                                                    <div class="label">Площадь спортивных зон на 100000 населения</div>
                                                    <div class="value">${sumSpecific}</div>
                                                </div>
                                                <div class="fieldCont">
                                                    <div class="label">Кол-во спортивных зон на 100000 населения</div>
                                                    <div class="value">${countSpecific}</div>
                                                </div>`;

                                                if (!this.props.sportId) {
                                                    text +=
                                                        `
                                                <div class="fieldCont">
                                                    <div class="label">Кол-во видов спортивных услуг на 100000 населения</div>
                                                    <div class="value">${countRolesSpecific}</div>
                                                </div>
                                                `;
                                                }

                                                text +=
                                                    `
                                            </div>
                                            `;

                                                this.polys.push(poly);
                                                poly.bindPopup(text);
                                            }

                                            // poly.on('click', () => {

                                            // });
                                        });
                                    }
                                }

                                // Question???
                                /// shit structure: see above
                                if (this.prevProps?.isCoverNet !== this.props.isCoverNet) {
                                    this.polys.forEach((poly) => {
                                        poly.removeFrom(this.map);
                                    });

                                    if (this.props.isCoverNet) {
                                        shadowScreen();

                                        setTimeout(() => {
                                            getNet(this.props.objs).then((arr) => {
                                                arr.forEach((row, i) => {
                                                    if (i < +Infinity) {
                                                        let shiftLat = 0.005;
                                                        let shiftLng = shiftLat * 2;

                                                        let coords = [
                                                            [row.lat - shiftLat, row.lng - shiftLng],
                                                            [row.lat - shiftLat, row.lng + shiftLng],
                                                            [row.lat + shiftLat, row.lng + shiftLng],
                                                            [row.lat + shiftLat, row.lng - shiftLng]
                                                        ];

                                                        let poly = DG.polygon(coords, {color: row.color}).addTo(this.map);
                                                        // poly.bindPopup(row.lat + '-' + row.lng);

                                                        poly.addTo(this.map);
                                                        this.polys.push(poly);
                                                    }
                                                });

                                                unshadowScreen();
                                            });
                                        });
                                    }
                                }
                            }
                        }
                    }}>
                </div>
            </>
        );
    }
}


interface MapMainTwoProps {
    objs: IObj[],
    emitter: EventEmitter,
    isPopulationLayer: boolean,
    isCoverNet: boolean,
    isAvailOnClick: boolean,
    districts: IDistrict[],
    sportId: number
}

export const MapMainTwo: React.FC<MapMainTwoProps> = React.memo((props) => {
        console.log('from map')

        //state
        const [map, setMap] = useState(null)
        const [actualState, setActualState] = useState({
            isAvailOnClick: props.isAvailOnClick,
            objs: props.objs,
        })
        let circles = []
        let nearestMarkers = []
        let intersectPoly


        //callbacks
        const formPopupInnerHTML = (obj: IObj) => {
            let affinityName = spr_affinity[obj.affinityId];

            let res = `
            <div class="popup" title="id: ${obj.id}">
                <!-- div class="fieldCont">
                    ${obj.lat} - ${obj.lng}
                </div -->
                <div class="fieldCont">
                    <div class="label">Наименование спортивного объекта</div>
                    <div class="value">${obj.name}</div>
                </div>
                <div class="fieldCont">
                    <div class="label">Ведомственная принадлежность</div>
                    <div class="value">${obj.org || '-'}</div>
                </div>
                <div class="fieldCont">
                    <div class="label">Общая площадь, кв.м.</div>
                    <div class="value">${obj.square || '-'}</div>
                </div>
                <div class="section">`;

            obj?.parts.forEach((part, i) => {
                let zonetypeName = spr_zonetype[part.sportzonetypeId];

                if (i) {
                    res += `<div class="preborder"></div>`;
                }

                res +=
                    `
                    <div class="fieldCont">
                        <div class="label">Спортивная зона ${i + 1}</div>
                        <div class="value">${part.sportzone}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Тип</div>
                        <div class="value">${zonetypeName || '-'}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Площадь, кв.м.</div>
                        <div class="value">${part.square || '-'}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Виды спорта</div>
                        <div class="sports">
                            ${part.roles.map((sportId) => `<div class="value">${spr_sport[sportId]}</div>`).join('\n')}
                        </div>
                    </div>
                `;

            });

            res += `
            </div>
            <div class="fieldCont">
                    <div class="label">Доступность</div>
                    <div class="value">${affinityName}</div>
                </div>
            </div>
        `;

            return res;
        }
        const nearestObj = (event: any, map: any, objs: IObj[]) => {
            let minLat = +Infinity;
            let minLng = +Infinity;
            let maxLat = 0;
            let maxLng = 0;
            let objsFound: Array<IObj & { radius: number }> = [];
            objs.forEach((obj, pos) => {
                const distance = map.distance(event.latlng, {
                    lat: obj.lat,
                    lng: obj.lng,
                })

                let radii = [5000, 3000, 1000, 500];
                let radius = radii[obj.affinityId - 1];

                if (distance <= radius) {
                    let marker = DG.marker({lat: obj.lat, lng: obj.lng}).addTo(map);
                    let popupContent = formPopupInnerHTML(obj);
                    marker.bindPopup(popupContent);

                    let radii = [5000, 3000, 1000, 500];
                    let radius = radii[obj.affinityId - 1];

                    let rgbStr = getColorBySquare(obj.square);
                    marker.on('click', () => {
                        let circle = DG.circle([obj.lat, obj.lng], {radius, color: rgbStr}).addTo(map);
                        circle.square = obj.square;

                        circles.push(circle);
                    });

                    nearestMarkers.push(marker);
                    objsFound.push({...obj, radius})

                    if (obj.lat < minLat) {
                        minLat = obj.lat;
                    }
                    if (obj.lat > maxLat) {
                        maxLat = obj.lat;
                    }
                    if (obj.lng < minLng) {
                        minLng = obj.lng;
                    }
                    if (obj.lng > maxLng) {
                        maxLng = obj.lng;
                    }
                    nearestMarkers.push(marker)
                }
            })
            let amendLat = 0.05;
            let amendLng = 0.05 * 2;

            let startLat = minLat - amendLat;
            let startLng = minLng - amendLng;
            if (objsFound.length) {
                const STEP_LAT = 0.0001; // ~ 10 м
                const STEP_LNG = STEP_LAT * 2; // ~ 100 м

                let i = 0;
                let lat;
                let lng;

                let points = [];
                do {
                    let j = 0;

                    do {
                        lat = startLat + i * STEP_LAT;
                        lng = startLng + j * STEP_LNG;

                        // for each obj in found objs calculate
                        // distance between current latlng. Why?
                        // If dist-e greater then obj radius
                        // then isIn turn on false and break loop
                        // only when all objs in accessing point go to array
                        let isIn = true;
                        for (let k = 0; k < objsFound.length; k++) {
                            let d = map.distance(
                                {
                                    lat: objsFound[k].lat,
                                    lng: objsFound[k].lng
                                },
                                {
                                    lat,
                                    lng
                                }
                            );

                            if (d > objsFound[k].radius) {
                                isIn = false;
                                break;
                            }
                        }

                        // if isIn true push point to points
                        if (isIn) {
                            points.push([lat, lng]);
                        }

                        j += 1;
                    } while (lng <= maxLng + amendLng);

                    i += 1;
                } while (lat <= maxLat + amendLat);

                if (points.length) {

                    let coords = hull(points);

                    let zoneRes = getZoneInfo(objsFound)
                    intersectPoly = DG.polygon(coords, {color: zoneRes.rgbStr}).addTo(map);

                    let popupContent =
                        `
                <div class="popup">
                    <div class="fieldCont">
                        Находится в зоне доступности для кол-ва объектов: '+ ${objsFound.length}
                    </div>
                    <div class="fieldCont">
                        Суммарная площадь: '+ ${zoneRes.sumSquare || '-'}
                    </div>
                    <div class="fieldCont">
                        <div class="label">Типы спорт. зон</div>
                        <div class="sports">
                            ${zoneRes.zoneTypes.map((name) => `<div class="value">${name}</div>`).join('\n')}
                        </div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Виды спорта</div>
                        <div class="sports">
                            ${zoneRes.sports.map((name) => `<div class="value">${name}</div>`).join('\n')}
                        </div>
                    </div>
                </div>
                `;

                    intersectPoly.bindPopup(popupContent);
                }
            }
        }
        const getZoneInfo = (objsFound) => {
            let sumSquare = 0;
            let zoneTypeIds = [];
            let sportIds = [];

            objsFound.forEach((obj) => {
                sumSquare += obj.square;

                obj.parts.forEach(part => {
                    zoneTypeIds.push(part.sportzonetypeId);
                    sportIds = sportIds.concat(part.roles);
                })
            });

            zoneTypeIds = array_unique(zoneTypeIds);
            sportIds = array_unique(sportIds);

            let zoneTypes = zoneTypeIds.map(id => spr_zonetype[id]);
            let sports = sportIds.map(id => spr_sport[id]);

            let rgbStr = getColorBySquare(sumSquare);
            return {zoneTypes, sports, rgbStr, sumSquare}
        }
        const setMyMarkerOnMap = (event: any, map: any) => {
            let myIcon = DG.icon({
                iconUrl: arrow,
                iconSize: [30, 30]
            });
            let latlng = [event.latlng.lat, event.latlng.lng]
            const marker = DG.marker([...latlng], {icon: myIcon, opacity: 0.6}).addTo(map);
            nearestMarkers.push(marker)
        }

        const removeObjectsFromMap = (map: any) => {
            circles.forEach(circle => {
                circle.removeFrom(map);
            })
            circles = []

            nearestMarkers.forEach(marker => {
                marker.removeFrom(map);
            });
            nearestMarkers = []

            if (intersectPoly) {
                intersectPoly.removeFrom(map);
            }
        }

        const actionsWithActualIsAvailOnClick = (event, map) => (actualState) => {
            if (actualState.isAvailOnClick) {
                removeObjectsFromMap(map)
                setMyMarkerOnMap(event, map)
                nearestObj(event, map, actualState.objs)
            }
            return actualState
        }

        useEffect(() => {
            setActualState({isAvailOnClick: props.isAvailOnClick, objs: props.objs})
        }, [props.isAvailOnClick, props.objs])
        return (
            <>
                <div id="map"
                     style={{width: '100%', height: '100%'}}
                     ref={(node) => {
                         if (node) {
                             if (!map) {
                                 let mapElem = DG.map('map', {
                                     'center': [55.754753, 37.620861],
                                     'zoom': 11
                                 })
                                 mapElem.on('click', (event) => {
                                     setActualState(actionsWithActualIsAvailOnClick(event, mapElem))
                                 })
                                 setMap(mapElem)
                             } else {
                                 removeObjectsFromMap(map)
                             }
                         }
                     }}/>
            </>
        )
    }
)