"use client"

import { useRef, useCallback } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line, Pie, Scatter } from "react-chartjs-2"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { format, isValid, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as THREE from "three"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

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

// Helper function to determine if a value is numeric
const isNumeric = (value) => {
  return typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)))
}

// Helper function to check if a string is a date
const isDateString = (str) => {
  if (typeof str !== "string") return false

  // Try to parse common date formats
  const dateFormats = [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "yyyy/MM/dd",
    "MMM yyyy",
    "MMMM yyyy",
    "MMM dd, yyyy",
    "MMMM dd, yyyy",
  ]

  for (const format of dateFormats) {
    const date = parse(str, format, new Date())
    if (isValid(date)) return true
  }

  // Check for month names
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ]

  return months.includes(str.toLowerCase())
}

// Helper function to format date labels
const formatDateLabel = (label) => {
  if (typeof label !== "string") return label

  // Try to parse and format dates
  const dateFormats = [
    { parse: "yyyy-MM-dd", display: "MMM dd" },
    { parse: "MM/dd/yyyy", display: "MMM dd" },
    { parse: "dd/MM/yyyy", display: "MMM dd" },
    { parse: "yyyy/MM/dd", display: "MMM dd" },
    { parse: "MMM yyyy", display: "MMM yyyy" },
    { parse: "MMMM yyyy", display: "MMMM yyyy" },
    { parse: "MMM dd, yyyy", display: "MMM dd" },
    { parse: "MMMM dd, yyyy", display: "MMM dd" },
  ]

  for (const df of dateFormats) {
    try {
      const date = parse(label, df.parse, new Date())
      if (isValid(date)) {
        return format(date, df.display)
      }
    } catch (e) {
      // Continue to next format if parsing fails
    }
  }

  // Handle month names
  const monthMap = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec",
    jan: "Jan",
    feb: "Feb",
    mar: "Mar",
    apr: "Apr",
    may: "May",
    jun: "Jun",
    jul: "Jul",
    aug: "Aug",
    sep: "Sep",
    oct: "Oct",
    nov: "Nov",
    dec: "Dec",
  }

  const lowerLabel = label.toLowerCase()
  return monthMap[lowerLabel] || label
}

// Helper function to prepare chart data using the specified logic
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
  const isDateLabels = rawLabels.some((label) => isDateString(label))
  const labels = isDateLabels ? rawLabels.map((label) => formatDateLabel(label)) : rawLabels

  // For scatter plots, we need a different data format
  if (type === "scatter") {
    return {
      datasets: dataColumns.map((col, index) => ({
        label: col,
        data: data.map((item) => ({
          x: rawLabels.indexOf(item[labelColumn]),
          y: isNumeric(item[col]) ? Number(item[col]) : 0,
        })),
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
        borderColor: CHART_BORDER_COLORS[index % CHART_BORDER_COLORS.length],
      })),
    }
  }

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

// 2D Charts
function Chart2D({ data, columns, chartConfig }) {
  const { type, title } = chartConfig
  const chartData = prepareChartData(data, columns, type)
  const chartRef = useRef(null)

  const handleDownload = useCallback(() => {
    if (chartRef.current) {
      // Get the canvas element
      const canvas = chartRef.current.canvas

      // Create a temporary link element
      const link = document.createElement("a")
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-chart.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }, [title])

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">No valid data for chart</div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales:
      type !== "pie"
        ? {
            x: {
              title: {
                display: true,
                text: columns[0], // Use first column name as x-axis title
                font: {
                  weight: "bold",
                },
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Value",
                font: {
                  weight: "bold",
                },
              },
            },
          }
        : undefined,
  }

  // Render appropriate chart based on type
  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar ref={chartRef} data={chartData} options={options} height={400} />
      case "line":
        return <Line ref={chartRef} data={chartData} options={options} height={400} />
      case "pie":
        return <Pie ref={chartRef} data={chartData} options={options} height={400} />
      case "scatter":
        return <Scatter ref={chartRef} data={chartData} options={options} height={400} />
      default:
        return <Bar ref={chartRef} data={chartData} options={options} height={400} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Download PNG
        </Button>
      </div>
      <div className="h-[400px]">{renderChart()}</div>
    </div>
  )
}

// 3D Bar Chart
function BarChart3D({ chartData, columns }) {
  if (!chartData || !chartData.labels || !chartData.datasets) return null

  const { labels, datasets, rawLabels } = chartData
  const maxValue = Math.max(...datasets.flatMap((dataset) => dataset.data))
  const barWidth = 0.8
  const groupSpacing = 2
  const barSpacing = 0.2
  const totalWidth =
    labels.length * (datasets.length * barWidth + (datasets.length - 1) * barSpacing + groupSpacing) - groupSpacing

  return (
    <group position={[-totalWidth / 2, 0, 0]}>
      {labels.map((label, labelIndex) => (
        <group
          key={labelIndex}
          position={[
            labelIndex * (datasets.length * barWidth + (datasets.length - 1) * barSpacing + groupSpacing),
            0,
            0,
          ]}
        >
          {datasets.map((dataset, datasetIndex) => {
            const height = (dataset.data[labelIndex] / maxValue) * 5 || 0.1
            const color = dataset.backgroundColor.replace("rgba(", "").replace(")", "").split(",")
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

            return (
              <group key={datasetIndex} position={[datasetIndex * (barWidth + barSpacing), 0, 0]}>
                <mesh position={[0, height / 2, 0]}>
                  <boxGeometry args={[barWidth, height, barWidth]} />
                  <meshStandardMaterial color={rgbColor} />
                </mesh>
              </group>
            )
          })}
          <Text
            position={[(datasets.length * (barWidth + barSpacing) - barSpacing) / 2, -0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {String(labels[labelIndex]).substring(0, 10)}
          </Text>
        </group>
      ))}

      {/* Legend */}
      <group position={[totalWidth / 2 + 2, 2, 0]}>
        {datasets.map((dataset, index) => {
          const color = dataset.backgroundColor.replace("rgba(", "").replace(")", "").split(",")
          const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

          return (
            <group key={index} position={[0, -index * 0.5, 0]}>
              <mesh position={[-0.5, 0, 0]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color={rgbColor} />
              </mesh>
              <Text position={[0.2, 0, 0]} fontSize={0.25} color="black" anchorX="left" anchorY="middle">
                {dataset.label}
              </Text>
            </group>
          )
        })}
      </group>

      {/* X-axis label */}
      <Text
        position={[totalWidth / 2 - totalWidth / 2, -1.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {columns[0]}
      </Text>
    </group>
  )
}

// 3D Line Chart
function LineChart3D({ chartData, columns }) {
  if (!chartData || !chartData.labels || !chartData.datasets) return null

  const { labels, datasets } = chartData
  const maxValue = Math.max(...datasets.flatMap((dataset) => dataset.data))
  const pointSpacing = 1.5
  const totalWidth = (labels.length - 1) * pointSpacing

  return (
    <group position={[-totalWidth / 2, 0, 0]}>
      {datasets.map((dataset, datasetIndex) => {
        const color = dataset.backgroundColor.replace("rgba(", "").replace(")", "").split(",")
        const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        const points = dataset.data.map((value, index) => [index * pointSpacing, (value / maxValue) * 5 || 0.1, 0])

        return (
          <group key={datasetIndex} position={[0, 0, datasetIndex * 1]}>
            {/* Line segments */}
            {points.map((point, index) => {
              if (index === 0) return null
              const prevPoint = points[index - 1]

              // Create a line between points
              const linePoints = []
              linePoints.push(new THREE.Vector3(prevPoint[0], prevPoint[1], prevPoint[2]))
              linePoints.push(new THREE.Vector3(point[0], point[1], point[2]))
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)

              return (
                <line key={`line-${index}`} geometry={lineGeometry}>
                  <lineBasicMaterial color={rgbColor} linewidth={3} />
                </line>
              )
            })}

            {/* Points */}
            {points.map((point, index) => (
              <group key={`point-${index}`} position={point}>
                <mesh>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshStandardMaterial color={rgbColor} />
                </mesh>
              </group>
            ))}
          </group>
        )
      })}

      {/* X-axis labels */}
      {labels.map((label, index) => (
        <Text
          key={index}
          position={[index * pointSpacing, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {String(label).substring(0, 10)}
        </Text>
      ))}

      {/* Legend */}
      <group position={[totalWidth / 2 + 2, 2, 0]}>
        {datasets.map((dataset, index) => {
          const color = dataset.backgroundColor.replace("rgba(", "").replace(")", "").split(",")
          const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

          return (
            <group key={index} position={[0, -index * 0.5, 0]}>
              <mesh position={[-0.5, 0, 0]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color={rgbColor} />
              </mesh>
              <Text position={[0.2, 0, 0]} fontSize={0.25} color="black" anchorX="left" anchorY="middle">
                {dataset.label}
              </Text>
            </group>
          )
        })}
      </group>

      {/* X-axis label */}
      <Text
        position={[totalWidth / 2 - totalWidth / 2, -1.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {columns[0]}
      </Text>
    </group>
  )
}

// 3D Pie Chart
function PieChart3D({ chartData }) {
  if (!chartData || !chartData.labels || !chartData.datasets || chartData.datasets.length === 0) return null

  const { labels, datasets } = chartData
  const dataset = datasets[0] // Use the first dataset for pie chart
  const total = dataset.data.reduce((sum, value) => sum + value, 0)
  const radius = 2.5
  const height = 0.5

  let startAngle = 0

  return (
    <group rotation={[-Math.PI / 4, 0, 0]}>
      {dataset.data.map((value, index) => {
        const angle = (value / total) * Math.PI * 2
        const midAngle = startAngle + angle / 2
        const color = datasets[0].backgroundColor[index].replace("rgba(", "").replace(")", "").split(",")
        const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

        const segment = (
          <group key={index}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[radius, radius, height, 32, 1, false, startAngle, angle]} />
              <meshStandardMaterial color={rgbColor} />
            </mesh>
          </group>
        )

        startAngle += angle
        return segment
      })}
    </group>
  )
}

// 3D Scatter Plot
function ScatterPlot3D({ data, columns }) {
  if (!data || data.length === 0 || !columns || columns.length < 2) return null

  // Use first column for labels, all other columns for data points
  const labelColumn = columns[0]
  const dataColumns = columns.slice(1)

  // Create a mapping of label values to positions
  const uniqueLabels = [...new Set(data.map((item) => item[labelColumn]))]
  const labelPositions = {}
  uniqueLabels.forEach((label, index) => {
    labelPositions[label] = index
  })

  return (
    <group>
      {data.map((item, itemIndex) => {
        // For each data item, create points for each data column
        return dataColumns.map((col, colIndex) => {
          const x = labelPositions[item[labelColumn]] - uniqueLabels.length / 2
          const y = isNumeric(item[col]) ? Number(item[col]) : 0
          const z = colIndex - dataColumns.length / 2

          return (
            <group key={`${itemIndex}-${colIndex}`} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={CHART_COLORS[colIndex % CHART_COLORS.length]} />
              </mesh>
            </group>
          )
        })
      })}

      {/* Axes */}
      <group position={[0, 0, 0]}>
        {/* X-axis */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[uniqueLabels.length + 1, 0.05, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <Text position={[uniqueLabels.length / 2 + 0.5, 0, 0]} fontSize={0.3} color="black">
          {columns[0]}
        </Text>

        {/* Y-axis */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[0.05, 5.5, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <Text position={[0, 6, 0]} fontSize={0.3} color="black">
          Values
        </Text>

        {/* Z-axis */}
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[dataColumns.length + 1, 0.05, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <Text position={[0, 0, dataColumns.length / 2 + 0.5]} fontSize={0.3} color="black">
          Data Series
        </Text>

        {/* X-axis labels */}
        {uniqueLabels.map((label, index) => (
          <Text
            key={`label-${index}`}
            position={[index - uniqueLabels.length / 2, -0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.25}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {String(label).substring(0, 8)}
          </Text>
        ))}

        {/* Z-axis labels (data series) */}
        {dataColumns.map((col, index) => (
          <Text
            key={`col-${index}`}
            position={[0, -0.5, index - dataColumns.length / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.25}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {String(col).substring(0, 8)}
          </Text>
        ))}
      </group>
    </group>
  )
}

// Animated scene wrapper
function Scene({ children }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.2
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// 3D Charts
function Chart3D({ data, columns, chartConfig }) {
  const { type, title } = chartConfig
  const chartData = prepareChartData(data, columns, type)
  const canvasRef = useRef(null)

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      // Get the canvas element from the ref
      const canvas = canvasRef.current.querySelector("canvas")

      if (canvas) {
        try {
          // For WebGL canvas, we need to use toDataURL directly with preserveDrawingBuffer enabled
          const dataUrl = canvas.toDataURL("image/png")

          // Create a temporary link element
          const link = document.createElement("a")
          link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-3d-chart.png`
          link.href = dataUrl
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (error) {
          console.error("Error downloading chart:", error)
        }
      }
    }
  }, [title])

  if (!chartData && type !== "scatter") {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">No valid data for chart</div>
    )
  }

  // Render appropriate 3D chart based on type
  const render3DChart = () => {
    return (
      <div ref={canvasRef} className="h-[400px] bg-muted/20 rounded-md">
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Scene>
            {type === "bar" && <BarChart3D chartData={chartData} columns={columns} />}
            {type === "line" && <LineChart3D chartData={chartData} columns={columns} />}
            {type === "pie" && <PieChart3D chartData={chartData} />}
            {type === "scatter" && <ScatterPlot3D data={data} columns={columns} />}
          </Scene>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <gridHelper args={[20, 20, "#888888", "#444444"]} />
        </Canvas>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Download PNG
        </Button>
      </div>
      {render3DChart()}
    </div>
  )
}

export default function ChartDisplay({ data, columns, chartConfig }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[400px] text-muted-foreground">No data to display</div>
  }

  return (
    <div>
      {chartConfig.dimension === "2d" ? (
        <Chart2D data={data} columns={columns} chartConfig={chartConfig} />
      ) : (
        <Chart3D data={data} columns={columns} chartConfig={chartConfig} />
      )}
    </div>
  )
}
