import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GETBUDGETBYDATE_URL } from "../../Constants/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const BudgetReportView = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [totalForKani, settotalForKani] = useState()
    const [totalForBudget, settotalForBudget] = useState()
    const [totalForRevisedBudget, settotalForRevisedBudget] = useState()

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

    useEffect(() => {
        const totalForkani =
            Math.round(
                (Number(budgetData?.budgetData?.Kani?.BudgetRetail) || 0) +
                (Number(budgetData?.budgetData?.Kani?.BudgetKLC) || 0) +
                (Number(budgetData?.budgetData?.Kani?.BudgetWS) || 0)
            );
        settotalForBudget(totalForkani)

        console.log(totalForkani);  // This will be rounded to the nearest integer.
    }, [budgetData]);

    useEffect(() => {
        const totalForkani =
            Math.round(
                (Number(budgetData?.budgetData?.Kani?.BudgetRevisedRetail) || 0) +
                (Number(budgetData?.budgetData?.Kani?.BudgetRevisedKLC) || 0) +
                (Number(budgetData?.budgetData?.Kani?.BudgetRevisedWS) || 0)
            );
        settotalForRevisedBudget(totalForkani)

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
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailKaniValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailKaniValueCreated}</td>
                    </tr>

                    {/* Kani KLC Stock */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }}>Kani KLC Stock</th>

                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.Kani?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.Kani?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcKaniValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcKaniValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcKaniValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcKaniValueCreated}</td>
                    </tr>

                    {/* Kani Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Kani Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.Kani?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.Kani?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsKaniValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsKaniValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsKaniValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.wsKaniValueCreated}</td>
                    </tr>

                    {/* Total for Kani */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ verticalAlign: "middle" }}>
                            <b>Total</b>
                        </th>
                        <td style={{ border: "1px solid black" }}>{totalForBudget}</td>
                        <td style={{ border: "1px solid black" }}>{totalForRevisedBudget}</td>
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

                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetRetail}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetRevisedRetail}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.retailCPValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.retailCPValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailCPValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailCPValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina KLC Stock */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcCPValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcCPValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcCPValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcKaniValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina Wholesale</th>

                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsCPValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsCPValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsCPValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.wsCPValueCreated}</td>
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
                        <th style={{ border: "1px solid black" }} >Pashmina Embroidery Retail Client</th>

                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetRetail}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetRevisedRetail}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.retailPEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.retailPEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailPEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailCPValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Pashmina Embroidery KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcPEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcPEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcPEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcKaniValueCreated}</td>
                    </tr>
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Pashmina Embroidery Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsPEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsPEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsPEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.wsPEValueCreated}</td>
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
                        <th style={{ border: "1px solid black" }} >Contemporary Wool Retail Client</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRetail}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedRetail}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.retailCWValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.retailCWValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailCWValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailCPValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Wool KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcCWValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcCWValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcCWValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcKaniValueCreated}</td>
                    </tr>
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Wool Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsCWValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsCWValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsCWValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.wsCPValueCreated}</td>
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
                        <th style={{ border: "1px solid black" }} >Wool Embroidery Retail Client</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetRetail}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedRetail}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.retailWEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.retailWEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.retailWEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailCPValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Wool Embroidery KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcWEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcWEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcWEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcKaniValueCreated}</td>
                    </tr>
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Wool Embroidery Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsWEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsWEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsWEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.wsCPValueCreated}</td>
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