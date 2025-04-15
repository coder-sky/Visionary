import React, { useCallback, useMemo, useRef, useState } from 'react'
import NavBar from './NavBar'
import { Box, Button, Collapse, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid2, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Skeleton, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import { TabPanel, TabContext } from '@mui/lab';
import { Add, Analytics, AutoAwesome, CloudUpload, Delete, Download, FileUpload, FileUploadRounded, Info } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from "uuid"
import { TransitionGroup } from 'react-transition-group';
import AlertPop from '../Common/AlertPop';
import BarGraph from './2dGraphs/BarGraph';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LinearGradient } from 'react-text-gradients';
import LineGraph from './2dGraphs/LineGraph';
import PieGraph from './2dGraphs/PieGraph';
import ScatterGraph from './2dGraphs/ScatterGraph';
import Graphs3D from './3dGraphs/Graphs3D';

const markdownData = `### Data Analysis & Insights: Advertising Campaign Performance (October 7-12, 2024)

This analysis examines the performance of an advertising campaign from October 7th to 12th, 2024, based on the provided data.  Key metrics include Impressions, Clicks, Cost, and Reach.

#### Key Trends:

* **Significant Increase in Impressions and Clicks:**  A substantial increase in both Impressions and Clicks is observed from October 9th onwards, indicating a potential successful campaign scaling or increased ad exposure.  

* **Consistent Cost Increase with Impressions & Clicks:** The cost of the campaign shows a direct correlation with both Impressions and Clicks. This suggests that higher ad spend resulted in increased visibility and engagement.

* **High Reach:** Reach has consistently increased alongside impressions and clicks, demonstrating effective targeting and broad audience engagement. 

#### Metric Details:

| Date       | Impressions | Clicks | Cost    | Reach             |        
|------------|-------------|--------|---------|--------------------|       
| 2024-10-07 | 375,290     | 1,672  | $13,376 | 110,379.41        |        
| 2024-10-08 | 410,355     | 2,017  | $16,136 | 122,494.03        |        
| 2024-10-09 | 1,195,164   | 6,012  | $48,096 | 365,493.58        |        
| 2024-10-10 | 1,085,609   | 5,173  | $41,384 | 339,252.81        |        
| 2024-10-11 | 1,060,522   | 5,490  | $43,920 | 342,103.87        |        
| 2024-10-12 | 1,471,058   | 8,150  | $65,200 | 482,314.10        |        


#### Calculated Metrics:

To gain deeper insights, let's calculate some additional metrics:

* **Click-Through Rate (CTR):**  CTR = (Clicks / Impressions) * 100. This shows the percentage of impressions that resulted in clicks.  Analysis of the CTR over time would reveal trends in ad effectiveness.

* **Cost Per Click (CPC):** CPC = Cost / Clicks. This indicates the average cost of each click.  Tracking CPC helps optimize spending.

* **Cost Per Thousand Impressions (CPM):** CPM = (Cost / Impressions) * 1000.  This metric shows the cost for every 1000 impressions.


#### Recommendations:

* **Further Analysis of CTR & CPC:** A detailed analysis of the daily CTR and CPC is crucial to understand campaign efficiency and identify areas for 
improvement.  Were certain ad creatives or targeting strategies more effective?

* **Investigate October 9th Increase:**  The significant jump in metrics on October 9th warrants investigation. Was there a change in ad strategy, increased budget allocation, or a seasonal event impacting results?

* **Consider Reach Optimization:** While reach is high, optimizing for a more specific target audience could improve CTR and reduce CPC, leading to better ROI.


This analysis provides a preliminary overview.  A more comprehensive investigation, including individual ad performance data and A/B testing results, 
would offer more granular insights and inform future campaign strategies. `

const baseStyle = {
  flex: 1,
  height: '150px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 4,
  borderColor: '#ccc',
  borderStyle: 'dashed',
  //backgroundColor: '#fafafa',

  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};


function ChartForm() {
  const colID = uuidv4()
  const rowID = uuidv4()
  const [activeTab, setActiveTab] = useState('manual')
  const [columns, setColumns] = useState({ [colID]: { colName: '', colType: 'text', } }) //useState([{ columnId: colID, colName: '', colType: 'text', }])
  const [rows, setRows] = useState({ [rowID]: [{ columnId: colID, rowData: '' }] })
  const [manualData, setManualData] = useState([{ columnId: colID, rowId: uuidv4(), rowData: '', }])
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
  const [chartFormFields, setChartFormFields] = useState({ title: '', diamention: '2d', type: '' })
  const [loading, setLoading] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const handleChartFormFieldsChange = (e) => {
    setChartFormFields({ ...chartFormFields, [e.target.name]: e.target.value })
  }
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setColumns({ [colID]: { colName: '', colType: 'text', } })
    setRows({ [rowID]: [{ columnId: colID, rowData: '' }] })

  };

  const handleColunmFields = (id, name, value) => {
    // console.log(id,name,value)
    setColumns({ ...columns, [id]: { ...columns[id], [name]: value } })

  }

  const handleRowFields = (rowId, colId, name, value) => {
    setRows({
      ...rows, [rowId]: rows[rowId].map(data => {
        
        if (data.columnId === colId) {
          value = columns[data.columnId]['colType']==='text'?String(value):Number(value)
          return { ...data, [name]: value }
        }
        else {
          return data
        }
      })
    })



  }

  const handleAddColumn = () => {

    if (Object.keys(columns).length <= 7) {
      const colId = uuidv4()
      const tempRows = { ...rows }
      Object.keys(rows).forEach(rowId => {
        tempRows[rowId] = [...tempRows[rowId], { columnId: colId, rowData: '' }]
      })

      setRows(tempRows)
      setColumns({ ...columns, [colId]: { colName: '', colType: 'number' } })
    }
    else {
      setAlertConfig({ open: true, type: 'error', message: 'Max 8 columns are allowed' })
    }


  }
  const handleDeleteColumn = (id) => {

    const tempCol = { ...columns }
    delete tempCol[id]
    // console.log(tempCol, rows)

    const tempRows = { ...rows }
    Object.keys(tempRows).forEach(rowId => {
      const rowData = tempRows[rowId].filter(info => info.columnId !== id)
      tempRows[rowId] = rowData

    })
    // console.log(id,tempRows)
    setRows(tempRows)
    setColumns(tempCol)
    //setColumns(columns.filter(col => col.columnId != id))

  }

  const handleAddRow = () => {
    const rowId = uuidv4()
    // console.log(rows, rows[0])
    setRows({ ...rows, [rowId]: rows[Object.keys(rows)[0]].map(data => ({ ...data, rowData: '' })) })
    //setManualData([...manualData, ...manualData.map(data=>({...data, rowData: '',}))])
  }
  const handleDeleteRow = (id) => {

    const tempRows = { ...rows }
    delete tempRows[id]
    setRows(tempRows)


  }

  const handleManualDataSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    try {

    } catch (error) {

    }
    finally {

    }
    setShowChart(true)
    setTimeout(() => setLoading(false), 5000)
    console.log(columns, rows)

    let manualData = []
    Object.keys(rows).forEach(rowId => {
      const row = {}
      rows[rowId].forEach(data => {
        row[columns[data.columnId]['colName']] = data.rowData
      })
      manualData.push(row)
    })
    setManualData(JSON.stringify(manualData))
    // console.log(manualData)
  }


  const handleDownload = useCallback(() => {
    
    if (chartRef.current) {
      // Get the canvas element
      const canvas = chartRef.current.canvas
      // Create a temporary link element
      const link = document.createElement("a")
      link.download = `${chartFormFields.title.toLowerCase()}-chart.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }, [chartFormFields.title])

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: { 'image/*': [] } });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);
  return (
    <Box sx={{ display: 'flex', }}>
      <NavBar />
      <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
        <Grid2 container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', mb: 2 }} elevation={15}>
              <Typography textAlign={'center'} sx={{ mb: 2 }} variant='p' component={'h2'}>Chart Configuration</Typography>
              <Box component={'form'} onSubmit={handleManualDataSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label='Chart Title'
                  required
                  sx={{ mb: 3 }}
                  size='small'
                  name='title'
                  value={chartFormFields.title}
                  onChange={handleChartFormFieldsChange}
                />
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={'center'} spacing={2} mb={2}>
                  <FormControl sx={{ minWidth: { xs: "100%", md: "150px" } }} component="fieldset" margin="normal">
                    <FormLabel required component="legend">Chart Dimension</FormLabel>
                    <RadioGroup

                      row
                      name='diamention'
                      value={chartFormFields.diamention}
                      onChange={handleChartFormFieldsChange}
                    >
                      <FormControlLabel value="2d" control={<Radio size="small" />} label="2D" />
                      <FormControlLabel value="3d" control={<Radio size="small" />} label="3D" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel size='small' id="chart-type-label">Chart Type</InputLabel>
                    <Select
                      size='small'
                      labelId="chart-type-label"
                      required
                      label="Chart Type"
                      name='type'
                      value={chartFormFields.type}
                      onChange={handleChartFormFieldsChange}

                    >
                      <MenuItem value="bar">Bar Chart</MenuItem>
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="pie">Pie Chart</MenuItem>
                      <MenuItem value="doughnut">Doughnut Chart</MenuItem>
                      <MenuItem value="radar">Radar Chart</MenuItem>
                      <MenuItem value="polarArea">Polar Area Chart</MenuItem>

                    </Select>
                  </FormControl>
                </Stack>
                <TabContext value={activeTab}>

                  <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }} aria-label="data entry tabs">
                    <Tab label="Manual Entry" value='manual' />
                    <Tab label="Excel Upload" value='upload' />
                  </Tabs>
                  <TabPanel value={'manual'} sx={{ p: 0, mt: 2 }}>
                    <Box sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: "center", alignItems: 'center' }}>
                          <Typography variant='p' component={'h4'}>Define Columns </Typography>
                          <Tooltip title='Max 8 columns are allowed' placement="right-start"> <Info sx={{ mt: 1 }} color='info' fontSize='20px' /></Tooltip>
                        </Box>
                        <Button variant='outlined' size='small' startIcon={<Add />} onClick={handleAddColumn}>Add Columns</Button>
                      </Box>


                      <TransitionGroup>
                        {
                          Object.keys(columns).map((colId, index) => (
                            <Collapse key={colId}>

                              <Stack mb={2} direction={'row'} spacing={2} alignItems={'center'}>
                                <Typography variant='p' component={'h4'}>{index + 1}.</Typography>
                                <TextField
                                  label='Column Name'
                                  placeholder='Add column name'
                                  name='colName'
                                  value={columns[colId]['colName']}
                                  onChange={e => handleColunmFields(colId, e.target.name, e.target.value)}
                                  size='small'
                                  required
                                  fullWidth
                                />
                                <FormControl fullWidth>
                                  <InputLabel required size='small'>Column Type</InputLabel>
                                  <Select required size='small' label='Column Type' name='colType' value={columns[colId].colType} onChange={e => handleColunmFields(colId, e.target.name, e.target.value)}>
                                    <MenuItem value='text'>Text</MenuItem>
                                    <MenuItem value='number'>Number</MenuItem>
                                  </Select>
                                </FormControl>
                                <IconButton color='error' disabled={Object.keys(columns).length == 1} size='small' onClick={() => handleDeleteColumn(colId)}>
                                  <Delete />
                                </IconButton>
                              </Stack>
                            </Collapse>
                          ))
                        }
                      </TransitionGroup>
                      <Divider />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2, alignItems: 'center' }}>
                        <Typography variant='p' component={'h4'}>Add Data</Typography>
                        <Button variant='outlined' size='small' startIcon={<Add />} onClick={handleAddRow}>Add Entry</Button>
                      </Box>

                      <TransitionGroup>
                        {
                          Object.keys(rows).map((rowID, index) => (
                            <Collapse key={rowID}>

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <Typography variant='p' component={'h5'} color='gray'>Row {index + 1}.</Typography>
                                <IconButton color='error' disabled={Object.keys(rows).length == 1} size='small' onClick={() => handleDeleteRow(rowID)}>
                                  <Delete />
                                </IconButton>
                              </Box>


                              <Stack mb={2} direction={'row'} spacing={2} alignItems={'center'} width={'100%'}>

                                {
                                  rows[rowID].slice(0, 4).map((row, index) => (
                                    <TextField

                                      key={index}
                                      label={columns[row.columnId]['colName']}
                                      type={columns[row.columnId]['colType']}
                                      placeholder='Add Data'
                                      name='rowData'
                                      value={row.rowData}
                                      onChange={e => handleRowFields(rowID, row.columnId, e.target.name, e.target.value)}
                                      size='small'
                                      required
                                      fullWidth
                                    />
                                  ))
                                }




                              </Stack>
                              <Stack mb={2} key={rowID} direction={'row'} spacing={2} alignItems={'center'}>
                                {
                                  rows[rowID].slice(4).map((row, index) => (
                                    <TextField
                                      key={index}
                                      label={columns[row.columnId]['colName']}
                                      type={columns[row.columnId]['colType']}
                                      placeholder='Add Data'
                                      value={row.rowData}
                                      name='rowData'

                                      onChange={e => handleRowFields(rowID, row.columnId, e.target.name, e.target.value)}
                                      size='small'
                                      required
                                      fullWidth
                                    />
                                  ))
                                }
                              </Stack>
                              <Divider />
                            </Collapse>
                          ))

                        }
                      </TransitionGroup>
                    </Box>
                  </TabPanel>
                  <TabPanel value={'upload'}>
                    <Box>
                      <div className="container">
                        <div {...getRootProps({ style })}>
                          <input {...getInputProps()} />
                          <CloudUpload sx={{ width: 40, height: 40 }} />
                          <p>Drag and drop or click to select Excel files (.xlsx, .xls)</p>
                        </div>
                      </div>

                    </Box>

                    {/* {file && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file:{" "}
              <Box component="span" fontWeight="bold">
                {file.name}
              </Box>
            </Typography>
          )} */}

                    {/* {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )} */}

                    {/* <Button
            variant="contained"
            color="primary"
            fullWidth
            //onClick={handleUpload}
            //disabled={!file || isUploading}
            //startIcon={<UploadI />}
          >
            
          </Button> */}
                  </TabPanel>
                </TabContext>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button sx={{ textTransform: 'none' }} loading={loading} type='submit' variant='contained' color='success' endIcon={<Analytics />}>Generate Chart</Button>
                </Box>


              </Box>

            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <Collapse in={showChart} unmountOnExit timeout={'auto'}>
              <Paper sx={{ }} elevation={8}>
                {loading && <Box position={'relative'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} width={'100%'} height={'400px'}>
                  <Typography position={'absolute'}  variant={'h1'} sx={{ opacity: 0.1 }}>Visualizing Data</Typography>
                  <Skeleton  animation='wave' variant="rounded" width={'100%'} height={'100%'} >
                  </Skeleton>
                </Box>}
                {!loading && <Box sx={{ p: 2, height: { xs: '100%', md: '420px' } }}>

                  <Box sx={{display:'flex', justifyContent:'flex-end'}}>
                    <Button size='small' variant='outlined' endIcon={<Download />} onClick={handleDownload}>
                      Download PNG
                    </Button>
                  </Box>
                  <Box  sx={{ width:'100%', height:{xs:'auto',md:'400px'},display:'flex', justifyContent:'center', alignItems:'flex-start', border:'1px solid red'}}>
                    {/* <LineGraph downloadRef={chartRef} graphTitle={chartFormFields.title} graphData={manualData} /> */}
                    {/* <PieGraph downloadRef={chartRef} graphTitle={chartFormFields.title} graphData={manualData} /> */}
                    {/* <ScatterGraph downloadRef={chartRef} graphTitle={chartFormFields.title} graphData={manualData} /> */}
                    <Graphs3D />
                  </Box>
                  
                </Box>}
              </Paper>
            </Collapse>

          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Collapse in={showChart} unmountOnExit timeout={'auto'}>
              <Paper sx={{  }} elevation={8}>

                {loading && <Box sx={{ p: 2 }} height={'370px'} >
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />



                </Box>}
                {!loading && <Box sx={{  overflow: 'auto' }} height={'450px'} >
                  <Typography component={'h3'} m={2} variant='p' gap={0.5} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ color: '#444cd1' }}><LinearGradient gradient={['to left', '#0d61ec ,#de0f82']}>AI-Insights <AutoAwesome fontSize='small' /> </LinearGradient></Typography>
                    <Container>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownData}</ReactMarkdown>
                    </Container>
                  





                </Box>}
              </Paper>

            </Collapse>
          </Grid2>


        </Grid2>
      </Box>
      <AlertPop alertConfig={alertConfig} />
    </Box>
  )
}

export default ChartForm