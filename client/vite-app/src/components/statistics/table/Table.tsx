import './table.css'

const Table = (props) => {
  return (
    <div>
      {
        props.bodyData && props.bodyData.length > 0 ?
        <div className="table-wrapper">
          <table>
            {
              props.headData && props.renderHead ? (
                <thead>
                  <tr>
                    {
                      props.headData.map((item, index) => props.renderHead(item, index))
                    }
                  </tr>
                </thead>
              ) : null
            }
            {
              props.bodyData && props.renderBody ? (
                <tbody>
                  {
                    props.bodyData.map((item) => props.renderBody(item))
                  }
                </tbody>
              ) : null
            }
          </table>
        </div>
        : <div style={{ textAlign: "center" }}>
          <h4>Para ver informacion deben existir transacciones en el periodo de tiempo seleccionado</h4>
        </div>
      }
    </div>
  )
}

export default Table