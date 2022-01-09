import React, {useState} from 'react'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import datum from '../data.json'
import matchSorter from 'match-sorter'

// Create an editable cell renderer
const EditableCell = (
  dataValue,
  rowIndex,
  columnId ,
  updateMyData, // This is a custom function that we supplied to our table instance
) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(dataValue,)
  console.log(rowIndex, columnId)
  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(rowIndex, columnId, dataValue,)
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(dataValue,)
  }, [dataValue])

  return <input value={dataValue} onChange={onChange} onBlur={onBlur} />
}


function Table({ columns, data, updateMyData, skipPageReset }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    updateMyData,
    autoResetPage: !skipPageReset,
  },
  useSortBy,
  usePagination
  )

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>        
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td  {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function App() {
  const [datas, setDatas] = useState(datum)
  const[originalData]= useState(datas)
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setDatas(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [datas])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setDatas(originalData)


  const data = React.useMemo(() => datas, [datas])
  const columns = React.useMemo(
    () => [
      {
        Header: 'full Name',
        accessor:"fullName",
      },
      {
        Header: 'Address',
        accessor:'address'
      },
      {
        Header: 'Phone Number',
        accessor:'phoneNumber'
      },
      {
        Header: 'Email',
        accessor:'email'
      },
      {
        Header: 'Delete',
        id: 'delete',
        accessor: (str) => 'delete',

    Cell: (tableProps) => (
      <span>
          <button style={{cursor:'pointer',color:'blue', marginRight:"5px"}}
        onClick={() => {
          console.log(tableProps)
        }}>
       Edit
      </button>
      <button style={{cursor:'pointer',color:'blue'}}
        onClick={() => {
          const id = tableProps.cell.row.original.id
          const newData =datas.filter(data=>data.id!==id)
          setDatas(newData)
          console.log(id)
          console.log(datas)
        }}>
       Delete
      </button>
      </span>
      
    ),
  },
    ],
    [datas]
  )


  return (
    <div>
      <button onClick={resetData}>Reset Data</button>
      <Table columns={columns} data={data} updateMyData={updateMyData}
      skipPageReset={skipPageReset} />
    </div>    
  )
}

export default App
