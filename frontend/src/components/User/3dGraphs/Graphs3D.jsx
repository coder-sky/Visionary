import React, { useRef, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import * as THREE from "three"
import LineGraph3D from "./LineGraph3D"
import { Container } from "@mui/material"
import BarGraph3D from "./BarGraph3D"
import PieGraph3D from "./PieGraph3D"
import ScatterGraph3D from "./ScatterGraph3D"

// Colors for charts
const CHART_COLORS = [
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(199, 199, 199, 0.8)",
    "rgba(83, 102, 255, 0.8)",
    "rgba(78, 181, 104, 0.8)",
    "rgba(225, 78, 202, 0.8)",
  ]
  
  // Border colors (slightly darker)
  const CHART_BORDER_COLORS = [
    "rgba(54, 162, 235, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(199, 199, 199, 1)",
    "rgba(83, 102, 255, 1)",
    "rgba(78, 181, 104, 1)",
    "rgba(225, 78, 202, 1)",
  ]

const isNumeric = (value) => {
    return typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)))
  }

const prepareChartData = (data, columns, type) => {
    if (!data || data.length === 0 || !columns || columns.length === 0) {
      return null
    }
  
    // Always use the first column as labels (x-axis)
    const labelColumn = columns[0]
    const dataColumns = columns.slice(1)
  
    // Get labels from the first column
    const rawLabels = data.map((item) => item[labelColumn] || "Unknown")
  
    // Format date labels if they appear to be dates
    // const isDateLabels = rawLabels.some((label) => isDateString(label))
    const labels =  rawLabels
  
  
    // Prepare datasets for each data column (for bar, line, pie)
    const datasets = dataColumns.map((col, index) => {
      return {
        label: col,
        data: data.map((item) => (isNumeric(item[col]) ? Number(item[col]) : 0)),
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
        borderColor: CHART_BORDER_COLORS[index % CHART_BORDER_COLORS.length],
        borderWidth: 1,
      }
    })
  
    return {
      labels,
      datasets,
      rawLabels,
    }
  }

  function Scene({ children }) {
    const groupRef = useRef()
  
    // useFrame(({ clock }) => {
    //   if (groupRef.current) {
    //     groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.2
    //   }
    // })
  
    return <group ref={groupRef}>{children}</group>
  }

function Graphs3D({ data, chartConfig }) {
    data = JSON.parse(data)
    let columns = Object.keys(data[0])
    let { type, title } = chartConfig
    const chartData = prepareChartData(data, columns, type)
    const canvasRef = useRef(null)
    
  
    // const handleDownload = useCallback(() => {
    //   if (canvasRef.current) {
    //     // Get the canvas element from the ref
    //     const canvas = canvasRef.current.querySelector("canvas")
  
    //     if (canvas) {
    //       try {
    //         // For WebGL canvas, we need to use toDataURL directly with preserveDrawingBuffer enabled
    //         const dataUrl = canvas.toDataURL("image/png")
  
    //         // Create a temporary link element
    //         const link = document.createElement("a")
    //         link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-3d-chart.png`
    //         link.href = dataUrl
    //         document.body.appendChild(link)
    //         link.click()
    //         document.body.removeChild(link)
    //       } catch (error) {
    //         console.error("Error downloading chart:", error)
    //       }
    //     }
    //   }
    // }, [title])

   
  
    if (!chartData && type !== "scatter") {
      return (
        <div className="">No valid data for chart</div>
      )
    }
  
    // Render appropriate 3D chart based on type
    const render3DChart = () => {
      return (
        <div ref={canvasRef} >
          <Canvas camera={{ position: [0, 5, 10], fov: 80 }} gl={{ preserveDrawingBuffer: true }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Scene>
                {/* <LineGraph3D chartData={chartData} columns={columns} /> */}
                {/* <BarGraph3D chartData={chartData} columns={columns} /> */}
                {/* <PieGraph3D chartData={chartData} columns={columns} /> */}
                <ScatterGraph3D data={data} columns={columns} />
              {/* {type === "bar" && <BarChart3D chartData={chartData} columns={columns} />}
              {type === "line" && <LineChart3D chartData={chartData} columns={columns} />}
              {type === "pie" && <PieChart3D chartData={chartData} />}
              {type === "scatter" && <ScatterPlot3D data={data} columns={columns} />} */}
            </Scene>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <gridHelper args={[40, 40, "#888888", "#444444"]} />
          </Canvas>
        </div>
      )
    }
  
    return (
      <>
      <Container sx={{height:{xs:'auto',md:'100%'}, maxWidth:{xs:'320px',md:'100%'}, overflow:'hidden'}}>
      {render3DChart()}
      </Container>
        
      </>
    )
  }


  

export default Graphs3D