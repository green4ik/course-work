import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut,Bar } from 'react-chartjs-2';
import { Dropdown } from 'react-bootstrap';

function AdminStats() {
  const [loading, setLoading] = useState(true); 
  const [loading2, setLoading2] = useState(true); 
  const [loading3, setLoading3] = useState(true);
  const [chartData, setChartData] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartData3, setChartData3] = useState({});
  const [productsData,setProductsData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2024);
  const randomRGBAColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 1; 
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  
  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(randomRGBAColor());
    }
    return colors;
  };
  
  useEffect(() => {
    const fetchData = async () => {
        //alert(selectedMonth);
        try {
            const response = await fetch("https://localhost:7183/api/Product/Get", {
              method: 'GET',
              headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
              }
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
    
            const data = await response.json();
            setProductsData(data);
            //  alert(productsData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          finally {
            setLoading2(false);
          }
      try {
        const response = await fetch('https://localhost:7183/api/Log/CalculateProducts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Accept": 'application/json'
          }
        });
       
        const data = await response.json();
       
        if (data && data.length > 0 ) {
          const labels = productsData.map(item => item.productName);
          const backgroundColors = generateRandomColors(labels.length);
          const quantities = data
  .filter(item => item.year == selectedYear && item.month == selectedMonth)
  .map(item => item.totalQuantity);
            //alert(labels);
          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Amount',
                data: quantities,
                backgroundColor: backgroundColors,
                borderWidth: 1
              }
            ]
          });
        } else {
          console.error('Error fetching data:');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchData2 = async () => {
        //alert(selectedMonth);
      try {
        const response = await fetch('https://localhost:7183/api/Log/CalculateTotalRevenue', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Accept": 'application/json'
          }
        });
        const response2 = await fetch('https://localhost:7183/api/Log/CalculateTotalSupplyCost', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Accept": 'application/json'
            }
          });
        const data = await response.json();
        const data2 = await response2.json();
       
        // alert(data.length);
        if (data && data.length > 0) {
            const months = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'
            ];
          
            const monthlyRevenue = Array.from({ length: 12 }, () => 0);
            const monthlySupply = Array.from({ length: 12 }, () => 0);
            data.forEach(item => {
                if(item.year == selectedYear) {
              const monthIndex = item.month - 1; 
              monthlyRevenue[monthIndex] = item.totalRevenue;
              // alert(monthlyRevenue[monthIndex]);
             
                }
            });
            data2.forEach(item => {
                if(item.year == selectedYear) {
                const monthIndex = item.month - 1; 
                monthlySupply[monthIndex] = -item.cost;
                // alert(monthlySupply[monthIndex]);
                
                }
              });
            const backgroundColors = generateRandomColors(12);
          
            setChartData2({
              labels: months,
              datasets: [
                {
                  label: 'Revenue',
                  data: monthlyRevenue,
                  backgroundColor: backgroundColors, 
                  borderWidth: 1
                },
                {
                    label: 'Supply',
                    data: monthlySupply,
                    backgroundColor: backgroundColors, 
                    borderWidth: 1
                  }
              ]
            });
            
          } else {
          console.error('Error fetching data:');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading3(false);
      }
    };
    fetchData();
    fetchData2();
  }, [loading2,selectedMonth,selectedYear,loading]);

  if (loading || loading2 || loading3) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <div>
        <Dropdown className ='w-50'>
          <Dropdown.Toggle className ='w-25'variant="success" id="dropdown-month">
            Select Month
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedMonth('1')}>January</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('2')}>February</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('3')}>March</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('4')}>April</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('5')}>May</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('6')}>June</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('7')}>July</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('8')}>August</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('9')}>September</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('10')}>October</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('11')}>November</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedMonth('12')}>December</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className ='w-50'>
          <Dropdown.Toggle className ='w-25' variant="success" id="dropdown-year">
            Select Year
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedYear('2023')}>2023</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedYear('2024')}>2024</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        Stats for {selectedYear}, {selectedMonth}th month
      </div>
      <div style={{ width: '600px', height: '600px', display:'flex', flexDirection: 'row'}}> 
        <Doughnut data={chartData} />
        <Bar data={chartData2} />
      </div>
    </div>
  );
}

export default AdminStats;
