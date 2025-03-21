import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GETBUDGETBYDATE_URL } from "../../Constants/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const BudgetReportView = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [totalForKani, settotalForKani] = useState()
    const { token } = currentUser;
    const location = useLocation();
    const [budgetData, setbudgetData] = useState()
    const { date } = location.state || { date: "" };

    const getBudget = async () => {
        try {
            const response = await fetch(`${GETBUDGETBYDATE_URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(date)
            });
            const data = await response.json();
            setbudgetData(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Currency");
        }
    };

    useEffect(() => {


        getBudget()
    }, [])
    useEffect(() => {
        const totalForkani =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.retailKaniValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.retailKaniValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.retailKaniValueExtra) || 0)
            );
        settotalForKani(totalForkani)

        console.log(totalForkani);  // This will be rounded to the nearest integer.
    }, [budgetData]);



    console.log(budgetData, "dateeeeeeeee");

    console.log(date, "ll")


    return (
        <div className="container-fluid">
            <h4 className="text-center">Budget Report</h4>
            <table className="table table-bordered"
                style={{ border: "1px solid black" }}>
                <thead>
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th className="text-center" style={{ verticalAlign: "middle", textAlign: "center", border: "1px solid black" }}>
                            <b>Product Group</b>
                        </th>
                        <th className="text-center" style={{ verticalAlign: "middle", textAlign: "center", border: "1px solid black" }}>
                            <b>Budget</b>
                        </th>
                        <th className="text-center" style={{ border: "1px solid black" }}>
                            <b>Revised Budget</b>
                        </th>
                        <th className="text-center" style={{ border: "1px solid black" }}>
                            <b>InProcess Orders</b>
                        </th>
                        <th className="text-center" style={{ border: "1px solid black" }}>
                            <b>Received Orders</b>
                        </th>
                        <th className="text-center" style={{ border: "1px solid black" }}>
                            <b>Extra Received</b>
                        </th>
                        <th className="text-center" style={{ border: "1px solid black" }}>
                            <b>Total Budget Utilised</b>
                        </th>
                        <th className="text-center" style={{ verticalAlign: "middle", textAlign: "center", border: "1px solid black" }}>
                            <b style={{ color: "green" }}>Budget Available</b>/<b style={{ color: "red" }}>Over Utilised</b>
                        </th>
                        <th className="text-center" style={{ verticalAlign: "middle", textAlign: "center", border: "1px solid black" }}>
                            <b>% Utilised</b>
                        </th>
                        <th className="text-center" style={{ border: "1px solid black" }}>
                            <b>Pending Orders</b>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Kani Retail Client */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Kani Retail Client</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.Kani?.BudgetRetail}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.Kani?.BudgetRevisedRetail}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.retailKaniValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.retailKaniValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailKaniValueCreated}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailKaniValueExtra}</td>
                    </tr>

                    {/* Kani KLC Stock */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }}>Kani KLC Stock</th>

                         <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.Kani?.BudgetRetail}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.Kani?.BudgetRevisedRetail}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.retailKaniValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.retailKaniValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailKaniValueCreated}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailKaniValueExtra}</td>
                    </tr>

                    {/* Kani Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Kani Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.Kani?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.Kani?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.retailKaniValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.retailKaniValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailKaniValueCreated}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailKaniValueExtra}</td>
                    </tr>

                    {/* Total for Kani */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ verticalAlign: "middle" }}>
                            <b>Total</b>
                        </th>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Contemporary Pashmina Retail Client */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina Retail Client</th>
                        <td style={{ border: "1px solid black" }} id="cprb">-</td>
                        <td style={{ border: "1px solid black" }} id="cprrb">-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }} id="cprtv">-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cprbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cprpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Contemporary Pashmina KLC Stock */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="cpkb">-</td>
                        <td style={{ border: "1px solid black" }} id="cpkrb">-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }} id="cpktv">-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpkbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpkpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="cpwb">-</td>
                        <td style={{ border: "1px solid black" }} id="cpwrb">-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }} id="cpwtv">-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpwbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpwpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Total for Contemporary Pashmina */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ verticalAlign: "middle" }}>
                            <b>Total</b>
                        </th>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>





                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="cpkb">-</td>
                        <td style={{ border: "1px solid black" }} id="cpkrb">-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }} id="cpktv">-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpkbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpkpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="cpwb">-</td>
                        <td style={{ border: "1px solid black" }} id="cpwrb">-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }} id="cpwtv">-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpwbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpwpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Total for Contemporary Pashmina */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ verticalAlign: "middle" }}>
                            <b>Total</b>
                        </th>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>








                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="cpkb">-</td>
                        <td style={{ border: "1px solid black" }} id="cpkrb">-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }} id="cpktv">-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpkbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpkpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="cpwb">-</td>
                        <td style={{ border: "1px solid black" }} id="cpwrb">-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }} id="cpwtv">-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpwbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="cpwpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>

                    {/* Total for Contemporary Pashmina */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ verticalAlign: "middle" }}>
                            <b>Total</b>
                        </th>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>-</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>-</td>
                    </tr>






                    {/* Add other product groups similarly */}
                </tbody>
            </table>
            <div>
                <button onClick={() => window.print()} className="btn btn-primary ml-5 float-right mb-3">
                    Print
                </button>
            </div>
        </div>
    );
};

export default BudgetReportView;