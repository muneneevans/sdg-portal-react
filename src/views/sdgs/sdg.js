import React, { useState , useEffect, useCallback} from "react";
import {
    Container, Row, Col, Card, CardImg, Button, Input, Nav, TabContent, TabPane
} from "reactstrap";
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';

import Header from "../../components/header";
import SdgMap from "../../visualizations/sdgMap";
import Footer from "../../components/footer";
import SdgChart from "../../visualizations/sdgChart";
import SdgHighChart from "../../visualizations/sdgHighChart";
import classnames from "classnames";

function Sdg(){
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;`;

    const Papa = require("papaparse/papaparse.min.js");
    const data = require('../../assets/data/globalDatabase.json');
    const sdg = data[0];
    const targets = sdg.targets;

    const image = require.context('../../assets/img/sdg_icons', true);
    const imgSrc = image(`./${sdg.image}.jpg`);

    //const countries = require("../../assets/data/countries.json");
    const [years, setYears] = useState([]);
    const [indicators, setIndicators] = useState([]);

    const [sdgMapData, setSdgMapData] = useState([]);
    const [sdgChartData, setSdgChartData] = useState([]);
    const [dataSource, setDataSource] = useState('pan');
    const [activeTab, setActiveTab] = useState('1.2');
    const [isLoading, setIsLoading] = useState(false);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [mapChartType, setMapChartType] = useState('chart');
    const [year, setYear] = useState('2006');
    const [indicator, setIndicator] = useState('3.2 Child mortality rate of girls (per 1 000 births) (per 1 000 live births)');
    
    let csvDataSourceData = '';
    let sdgData = '';
    let ind = [];


   //Function to load my indicators
    const getIndicators = useCallback(() => {
        const targetData = sdgData[0].targets;
        targetData.forEach(function(data){
            if(data.code === activeTab){
                ind = data.indicators;
            }
        })
        return ind;
    }, [indicator]);

    useEffect(() => {
        //Choosing the data source
        if(dataSource === 'pan'){
            csvDataSourceData = require("../../assets/data/sdg/pan.csv");
            sdgData = require('../../assets/data/globalDatabase.json');
        }else if (dataSource === 'gdb'){
            csvDataSourceData = require("../../assets/data/sdg/gdb.csv");
            sdgData = require('../../assets/data/globalDatabase.json');
        }
        const indicators = getIndicators();
        setIndicators(indicators);

        //Function to fetch data from csv file
        const loadSdgData = (sdgCsvFile, callback, callback2) => {
            setIsLoading(true);
            Papa.parse(sdgCsvFile, {
                download: true,
                header: true,
                complete: function(results){
                    callback(results.data);
                    callback2(results.data)
                    setIsLoading(false);
                }
            })
        }
        loadSdgData(csvDataSourceData, parseSdgData, parseChartData);
    }, [dataSource, indicator, year, activeTab]);

    //Formatting the map data
    const parseSdgData = (data) => {
        const years = [];
        const indicatorData = [];
        data.forEach(function(d){
            if(d.Year === year ){
                indicatorData.push({
                    "code": d.Code,
                    "drilldown" : d.Code,
                    "value": d[indicator],
                    "country": d.Entity
                })  
            }
            if(d.Entity === "Mauritius"){
                years.push(d.Year);
                years.sort((a, b) => b - a);
            }
        })
        setYears(years);
       setSdgMapData(indicatorData);
       return indicatorData;
    }

    // Formatting the chart data
    const parseChartData = (sdgData) =>{
        Object.defineProperty(Array.prototype, 'group', {
            enumerable: false,
            value: function (key) {
                let map = {};
                this.map(e => ({k: key(e), d: e})).forEach(e => {
                map[e.k] = map[e.k] || [];
                map[e.k].push(e.d);
                });
                return Object.keys(map).map(k => ({country: k, data: map[k]}));
            }
        });
        
        let newArray = sdgData.group(item => item.Entity)
        setSdgChartData(newArray)

        newArray.forEach(function (a) {
            a.data.forEach(function(d){
                console.log(d)
            })
        })
        return newArray;
    }
   
    const setGDBData = () => {
        setDataSource('gdb');
    }
    const setPanAfricanData = () =>{
        setDataSource('pan');
    }
    const handleIndicatorChange = (e) =>{
        setIndicator(e.target.value);
    }
    const handleYearChange = (e) =>{
        setYear(e.target.value);
    }
    const targetClick = (e) =>{
        setActiveTab(e.target.value);
    }

    const setMapType = () =>{
        setMapChartType('map')
    }
    const setChartType = () =>{
        setMapChartType('chart')
    }

    return(
        <>
        <Header></Header>
            <div className="container-fluid">
                <Row className="sdgBackground">
                    <Col md="2">
                        <CardImg alt=".." src={imgSrc}></CardImg>
                    </Col>
                    <Col md="10">
                    <h5 className="display-4 mt-2 mb-2"> {sdg.title} </h5>
                    <p> {sdg.description} </p>
                    </Col>
                </Row>
                <div className="targetButtons text-center mt-1 pt-1 pb-3">
                    <h5 className="display-4"> SDG {sdg.id} Targets  </h5>
                    <Nav className="justify-content-center">
                        {
                            targets.map((target, index) =>{  
                                return <Button key={index} onClick={targetClick} value={target.code}> 
                                            Target {target.code}
                                        </Button>
                            })
                        }  
                        </Nav>
                </div>
                <Container>
                    <Card className="mapChartCard">
                        <TabContent activeTab={activeTab}>
                            {
                                targets.map((target, index) =>{
                                    return <TabPane tabId={target.code} key={index}>
                                        <p className="p-3"> Target {target.code}: {target.title} </p>
                                        <Row className="text-center selectButtons"> 
                                            <Col md="6">
                                                <Button color="primary" onClick={setPanAfricanData} className={ dataSource === 'pan' ? 'active': '' } >PanAfrican MRS</Button>
                                                <Button color="primary" onClick={setGDBData} className={ dataSource === 'gdb' ? 'active': '' }  >Global Database</Button>
                                                
                                            </Col>
                                            <Col md="3">
                                                <Input type="select" name="yearSelect" className="btn btn-primary" onChange={handleIndicatorChange} value={indicator}>
                                                    <option>Select indicator</option>
                                                    {
                                                        indicators.map((indicator, index) => {
                                                         return <option key={index}>{indicator.title}</option>
                                                        })
                                                    }
                                                </Input>
                                            </Col>
                                            <Col md="3">
                                                <Input type="select" name="yearSelect" className="btn btn-primary" onChange={handleYearChange} value={year}> 
                                                <option>Select year</option>
                                                    {
                                                        years.map((year, index) => {
                                                        return <option key={index}> {year} </option>
                                                    })
                                                    }
                                                   
                                                   
                                                </Input>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                })
                            }
                        </TabContent>  

                        {
                            //Loading the map if the type is map
                            mapChartType === 'map' ? (
                                 isLoading ? (
                                    <div className='sweet-loading mt-4'>
                                        <ClipLoader css={override} sizeUnit={"px"} size={50}
                                        color={'#123abc'} loading={isLoading} />
                                    </div> 
                                ) : (
                                    <div className="mt-3 ">
                                        <SdgMap mySdgData ={sdgMapData}></SdgMap>
                                    </div>
                                )
                            ):(
                                //Loading the chart if the type is chart
                                isLoading ? (
                                    
                                    <div className='sweet-loading mt-4'>
                                        <ClipLoader css={override} sizeUnit={"px"} size={50}
                                        color={'#123abc'} loading={isLoading} />
                                    </div> 
                                ) : (
                                    <div>
                                     
                                        <div className="mt-3 ">
                                            <SdgChart myChartData = {sdgChartData} indicator = {indicator} years = {years}></SdgChart>
                                        </div>
                                    </div>
                                    
                                )
                            )
                        }

                        

                        <div>
                            <Button color="primary" type="button" className={ classnames("btn-icon" , { active: mapChartType === 'map' })} onClick={setMapType}>
                                <span className="btn-inner--icon">
                                    <i className="fa fa-globe" />
                                </span>
                                <span className="btn-inner--text">MAP</span>
                            </Button>
                            <Button color="primary" type="button" className={ classnames("btn-icon" , { active: mapChartType === 'chart' })}  onClick={setChartType}> 
                                <span className="btn-inner--icon">
                                <i className="fa fa-chart-bar"></i>
                                </span>
                                <span className="btn-inner--text">CHART</span>
                            </Button>
                        </div>
    </Card>
                </Container>
            </div>
            <Footer></Footer>
        </>
    )
}



export default Sdg;