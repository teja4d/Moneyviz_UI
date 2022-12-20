import { format } from 'path';
import React from 'react'
import { Badge, Table } from 'react-bootstrap';
import { formatText } from '../../helperfunctions/FormatText';
import './Hoverbox.css'
type ListProps = {
    listData: any[];
    labelName: string;
  };
const Hoverbox = ({listData,labelName}: ListProps) => {
        return (
          <>
           <div className="whiteBox" id="whitebox">
            <div className="font-bold">
                <h3 className="text-center labelText">{formatText(labelName)}</h3>
            </div>
            <Table className="p-4">
              <thead>
                <tr>
                  <th colSpan={10} className="bg-info tableHead">
                    Recent Transactions
                  </th>
                </tr>
                <tr>
                  <th className="title">Date</th>
                  <th className="title">Amount</th>
                  <th className="title">Balance</th>
                </tr>
              </thead>
      
              <tbody>
                {listData?.map((d: any, i: any) => (
                  <tr key={i}>
                    <td>
                      <Badge bg="primary" className="mr-2">
                        {d.transaction_date}
                      </Badge>
                    </td>
                    <td className={"amount" + d.type}>
                      {"£" + (d.credit_amount + d.debit_amount).toFixed(2)}
                    </td>
      
                    <td className="balanceAmount">{"£" + d.balance}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          </>
        );
      }

export default Hoverbox