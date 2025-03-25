import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GETBUDGETBYDATE_URL } from "../../Constants/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const BudgetReportView = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [totalForKani, settotalForKani] = useState()
    const [totalForKaniKlc, settotalForKaniKlc] = useState()
    const [totalFOrKaniWs, settotalFOrKaniWs] = useState()
    const [totalCpRetail, settotalCpRetail] = useState()
    const [totalcpklc, settotalcpklc] = useState()
    const [totalcpws, settotalcpws] = useState()









    const [totalEmRetail, settotalEmRetail] = useState()
    const [totalEmklc, settotalEmklc] = useState()
    const [totalEmWs, settotalEmWs] = useState()
    const [totalContemWoolRetail, settotalContemWoolRetail] = useState()
    const [totalContemWoolklc, settotalContemWoolklc] = useState()
    const [totalContemWoolWs, settotalContemWoolWs] = useState()
    const [totalwoolEmRetail, settotalwoolEmRetail] = useState()
    const [totalWoolEmbKlc, settotalWoolEmbKlc] = useState()
    const [totalwoolembws, settotalwoolembws] = useState()








    const [totalForBudget, settotalForBudget] = useState()
    const [totalForRevisedBudget, settotalForRevisedBudget] = useState()

    const [totalCpBudget, settotalCpBudget] = useState()
    const [totalCpRevisedBudget, settotalCpRevisedBudget] = useState()


    const [totalPeBudget, settotalPeBudget] = useState()
    const [totalPeRevisedBudget, settotalPeRevisedBudget] = useState()


    const [totalcwBudget, settotalcwBudget] = useState()
    const [totalcwRevisedBudget, settotalcwRevisedBudget] = useState()

    const [totalweBudget, settotalweBudget] = useState()
    const [totalweRevisedBudget, settotalweRevisedBudget] = useState()
    const [budgetVariancee, setbudgetVariancee] = useState()
    const [percenVariance, setpercenVariance] = useState()

    const { token } = currentUser;
    const location = useLocation();
    const [budgetData, setbudgetData] = useState()
    const { date } = location.state || { date: "" };








    // coloring

    const budgetVarianceStyle = budgetVariancee > 0 ? { backgroundColor: "red" } : { backgroundColor: "#90EE90" };
    const percentageVarianceStyle = percenVariance > 100 ? { backgroundColor: "red" } : { backgroundColor: "#90EE90" };

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


        const totalForkaniKlc =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.klcKaniValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.klcKaniValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.klcKaniValueExtra) || 0)
            );
        settotalForKaniKlc(totalForkani)



        const totalForkaniWs =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.wsKaniValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.wsKaniValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.wsKaniValueExtra) || 0)
            );
        settotalFOrKaniWs(totalForkani)



        const totalForContempRetail =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.retailCPValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.retailCPValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.retailCPValueExtra) || 0)
            );
        settotalCpRetail(totalForkani)



        const totalForContempklc =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.klcCPValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.klcCPValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.klcCPValueExtra) || 0)
            );
        settotalcpklc(totalForkani)



        const totalForContempws =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.wsCPValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.wsCPValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.wsCPValueExtra) || 0)
            );
        settotalcpws(totalForkani)





        const totalForPashminaRetail =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.retailPEValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.retailPEValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.retailPEValueExtra) || 0)
            );
        settotalEmRetail(totalForkani)



        const totalForPashminaklc =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.klcPEValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.klcPEValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.klcPEValueExtra) || 0)
            );
        settotalEmklc(totalForkani)


        const totalForPashminaws =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.wsPEValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.wsPEValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.wsPEValueExtra) || 0)
            );
        settotalEmWs(totalForkani)



        const totalForContempWoolRetail =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.retailCWValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.retailCWValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.retailCWValueExtra) || 0)
            );
        settotalContemWoolRetail(totalForkani)


        const totalForContempWoolklc =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.klcCWValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.klcCWValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.klcCWValueExtra) || 0)
            );
        settotalContemWoolklc(totalForkani)


        const totalForContempWoolws =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.wsCWValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.wsCWValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.wsCWValueExtra) || 0)
            );
        settotalContemWoolWs(totalForkani)




        const totalForwoolEmbRetail =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.retailWEValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.retailWEValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.retailWEValueExtra) || 0)
            );
        settotalwoolEmRetail(totalForkani)
        const totalForwoolEmbklc =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.klcWEValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.klcWEValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.klcWEValueExtra) || 0)
            );
        settotalWoolEmbKlc(totalForkani)
        const totalForwoolEmbws =
            Math.round(
                (Number(budgetData?.inProgressOrderProductsCalculate?.wsWEValueIP) || 0) +
                (Number(budgetData?.receivedQtyCalculation?.wsWEValue) || 0) +
                (Number(budgetData?.extraQtyCalculate?.wsWEValueExtra) || 0)
            );
        settotalwoolembws(totalForkani)


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


        const totalForkaniRevised =
            Math.round(
                (Number(budgetData?.budgetData?.Kani?.BudgetRevisedRetail) || 0) +
                (Number(budgetData?.budgetData?.Kani?.BudgetRevisedKLC) || 0) +
                (Number(budgetData?.budgetData?.Kani?.BudgetRevisedWS) || 0)
            );
        settotalForRevisedBudget(totalForkaniRevised)





        const totalForContemp =
            Math.round(
                (Number(budgetData?.budgetData?.["Contemporary Pashmina"]?.BudgetRetail) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Pashmina"]?.BudgetKLC) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Pashmina"]?.BudgetWS) || 0)
            );
        settotalCpBudget(totalForContemp)






        const totalForContempRevised =
            Math.round(
                (Number(budgetData?.budgetData?.["Contemporary Pashmina"]?.BudgetRevisedRetail) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Pashmina"]?.BudgetRevisedKLC) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Pashmina"]?.BudgetRevisedWS) || 0)
            );
        settotalCpRevisedBudget(totalForContempRevised)





        const totalForPE =
            Math.round(
                (Number(budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetRetail) || 0) +
                (Number(budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetKLC) || 0) +
                (Number(budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetWS) || 0)
            );
        settotalPeBudget(totalForPE)




        const totalForPERevised =
            Math.round(
                (Number(budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetRevisedRetail) || 0) +
                (Number(budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetRevisedKLC) || 0) +
                (Number(budgetData?.budgetData?.["Pashmina Embroidery"]?.BudgetRevisedWS) || 0)
            );
        settotalPeRevisedBudget(totalForPERevised)

        // This will be rounded to the nearest integer.




        // This will be rounded to the nearest integer.

        const totalForCW =
            Math.round(
                (Number(budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRetail) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Wool "]?.BudgetKLC) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Wool "]?.BudgetWS) || 0)
            );
        settotalcwBudget(totalForCW)

        // This will be rounded to the nearest integer.

        const totalForCWRevised =
            Math.round(
                (Number(budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedRetail) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedKLC) || 0) +
                (Number(budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedWS) || 0)
            );
        settotalcwRevisedBudget(totalForCWRevised)

        // This will be rounded to the nearest integer.
        const totalForWE =
            Math.round(
                (Number(budgetData?.budgetData?.['Wool Embroidery']?.BudgetRetail) || 0) +
                (Number(budgetData?.budgetData?.['Wool Embroidery']?.BudgetKLC) || 0) +
                (Number(budgetData?.budgetData?.['Wool Embroidery']?.BudgetWS) || 0)
            );
        settotalweBudget(totalForWE)


        const totalForWERevised =
            Math.round(
                (Number(budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedRetail) || 0) +
                (Number(budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedKLC) || 0) +
                (Number(budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedWS) || 0)
            );
        settotalweRevisedBudget(totalForWERevised)

        // This will be rounded to the nearest integer.
    }, [budgetData]);


    useEffect(() => {

        const budgetRevisedRetail = budgetData?.budgetData?.Kani?.BudgetRevisedRetail;

        const budgetVariance =
            typeof totalForKaniKlc === 'number' && typeof budgetRevisedRetail === 'number'
                ? totalForKaniKlc - budgetRevisedRetail
                : 0;
        setbudgetVariancee(budgetVariance)
        console.log(budgetVariance, "j");

        const percentageVariance = budgetData?.budgetData?.Kani?.BudgetRevisedRetail
            ? (totalForKaniKlc / budgetData?.budgetData?.Kani?.BudgetRevisedRetail) * 100
            : 0; // or any fallback value


        setpercenVariance(percentageVariance)


    }, [])













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
                        <td style={{ border: "1px solid black" }} id="krtv">{totalForKani}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value={budgetVariancee} style={{ border: "none", ...budgetVarianceStyle }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value={percenVariance} style={{ border: "none", ...percentageVarianceStyle }} id="krpbv" readOnly />
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
                        <td style={{ border: "1px solid black" }} id="krtv">{totalForKaniKlc}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="kkbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="kkpbv" readOnly />
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
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalFOrKaniWs}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="kkbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="kkpbv" readOnly />
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
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalCpRetail}</td>
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
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalcpklc}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcCPValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Pashmina Wholesale</th>

                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Contemporary Pashmina']?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsCPValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsCPValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsCPValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalcpws}</td>
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
                        <td style={{ border: "1px solid black" }}>{totalCpBudget}</td>
                        <td style={{ border: "1px solid black" }}>{totalCpRevisedBudget}</td>
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
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalEmRetail}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailPEValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Pashmina Embroidery KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcPEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcPEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcPEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalEmklc}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcPEValueCreated}</td>
                    </tr>
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Pashmina Embroidery Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Pashmina Embroidery']?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsPEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsPEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsPEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalEmWs}</td>
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
                        <td style={{ border: "1px solid black" }}>{totalPeBudget}</td>
                        <td style={{ border: "1px solid black" }}>{totalPeRevisedBudget}</td>
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
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalContemWoolRetail}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailCWValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Wool KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcCWValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcCWValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcCWValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalContemWoolklc}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcCWValueCreated}</td>
                    </tr>
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Contemporary Wool Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.["Contemporary Wool "]?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsCWValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsCWValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsCWValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalContemWoolWs}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.wsCWValueCreated}</td>
                    </tr>

                    {/* Total for Contemporary Pashmina */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ verticalAlign: "middle" }}>
                            <b>Total</b>
                        </th>
                        <td style={{ border: "1px solid black" }}>{totalcwBudget}</td>
                        <td style={{ border: "1px solid black" }}>{totalcwRevisedBudget}</td>
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
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalwoolEmRetail}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.retailWEValueCreated}</td>
                    </tr>

                    {/* Contemporary Pashmina Wholesale */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Wool Embroidery KLC Stock</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetKLC}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedKLC}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.klcWEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.klcWEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.klcWEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalWoolEmbKlc}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.klcWEValueCreated}</td>
                    </tr>
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ border: "1px solid black" }} >Wool Embroidery Wholesale</th>
                        <td style={{ border: "1px solid black" }} id="krb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetWS}</td>
                        <td style={{ border: "1px solid black" }} id="krrb">{budgetData?.budgetData?.['Wool Embroidery']?.BudgetRevisedWS}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.inProgressOrderProductsCalculate?.wsWEValueIP}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.receivedQtyCalculation?.wsWEValue}</td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.extraQtyCalculate?.wsWEValueExtra}</td>
                        <td style={{ border: "1px solid black" }} id="krtv"> {totalwoolembws}</td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            <input type="text" value="" style={{ border: "none" }} id="krpbv" readOnly />
                        </td>
                        <td style={{ border: "1px solid black" }}>{budgetData?.createdQtyCalculate?.wsWEValueCreated}</td>
                    </tr>

                    {/* Total for Contemporary Pashmina */}
                    <tr style={{ border: "1px solid black", height: "80px" }}>
                        <th style={{ verticalAlign: "middle" }}>
                            <b>Total</b>
                        </th>
                        <td style={{ border: "1px solid black" }}>{totalweBudget}</td>
                        <td style={{ border: "1px solid black" }}>{totalweRevisedBudget}</td>
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