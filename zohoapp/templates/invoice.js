function itemfunction(id_str) {
    console.log("Received ID:", id_str);
    const id = id_str.split("item")[1]
    console.log(id, "id o")


    select = $(`#item${id}`).val();
    customer = $('#customer_sel').val();
    $.ajax({
        type: "GET",
        url: "{% url 'itemdata_invoice' %}",
        data: {
            id: select,
            cust: customer
        },
        success: function (response) {
            console.log(response, "response")




            const data = response.rate
            const data1 = response.gst
            const data2 = response.igst
            const data3 = response.pos
            const data4 = response.place
            const stock = response.stock
            const hsn = response.hsn
            console.log(hsn, "hsn")
            const oxy_gst = data1
            const oxy_igst = data2
            document.getElementById(`hsn${id}`).value = hsn
            document.getElementById(`rate${id}`).value = data


            toggleDateInput(id, oxy_igst, oxy_gst);


            var rate = parseFloat(data);
            var qty = parseFloat($(`#qty${id}`).val());
            var tax = parseFloat($(`#tax${id}`).val());
            var discount = parseFloat($(`#discount${id}`).val());
            var rowAmount = (qty * rate) - discount;
            var taxAmount = (rowAmount * tax) / 100;
            $(`#amount${id}`).val(rowAmount.toFixed(2));
            $(`#taxamount${id}`).val(taxAmount.toFixed(2));
            $(`#stock_data${id}`).val(stock.toFixed(2));



            $(document).on('blur', `#qty${id}`, function () {
                initialStock = stock
                var enteredQuantity = parseInt($(`#qty${id}`).val());

                if (isNaN(initialStock) || isNaN(enteredQuantity)) {
                    console.log("Either initialStock or enteredQuantity is not a number.");
                    return;
                }

                if (enteredQuantity > 0) {
                    var updatedStock = initialStock - enteredQuantity;
                    console.log(updatedStock, "updated")
                    $(`#stock_data${id}`).val(updatedStock); // Use .val() instead of .text()
                    if (updatedStock < 0) {

                        // If entered quantity is not greater than 0, display a message
                        alert("Please enter a quantity less than stock.");
                    }
                }

                $(`#qty${id}`).val(enteredQuantity);
            });



            var subtotal = 0;
            item_table_rows = document.getElementById('item_table_body').querySelectorAll('tr')
            for (let i = 1; i <= item_table_rows.length; i++) {
                subtotal += parseFloat($(`#amount${id}`).val())
            }
            document.getElementById("subtotal").value = parseFloat(subtotal.toFixed(2))

            var grandTotal = 0;
            var totalTaxAmount = 0;
            adjust = parseFloat(document.getElementById('adjust').value)
            advance = parseFloat(document.getElementById('advance').value)
            for (let i = 1; i <= item_table_rows.length; i++) {
                var rowAmount = parseFloat($(`#amount${id}`).val());
                grandTotal += rowAmount;
                var taxAmount = parseFloat($(`#taxamount${id}`).val())
                grandTotal += taxAmount;
                totalTaxAmount += taxAmount;
            }
            var shippingCharges = parseFloat($('#shipping').val());
            var adjust = parseFloat($('#adjust').val());
            grandTotal += shippingCharges;
            grandTotal += adjust
            balance = grandTotal - advance
            $('#grandtotal').val(grandTotal.toFixed(2));
            $('#balance').val(balance.toFixed(2));
            $('#total_taxamount').val(totalTaxAmount.toFixed(2));


            var checkbox = document.getElementById("srcofsupply").value;
            var srcofsupply = checkbox; // Replace with the actual value of srcofsupply


            // Find the index of the hyphen
            var index = srcofsupply.indexOf("-");

            // Remove the first letters before the hyphen
            var result = srcofsupply.substring(index + 1);

            companyState = data4; // Replace with the actual value of company state
            calculateTaxAmount();
            var subtotal = parseFloat(document.getElementById("subtotal").value);
            var shipping = parseFloat(document.getElementById("shipping").value);
            var tax = parseFloat(document.getElementById("total_taxamount").value);
            adjust = parseFloat(document.getElementById('adjust').value)
            advance = parseFloat(document.getElementById('advance').value)
            var tax_rate = 0.0; // Default tax rate for IGST
            var total_taxamount = tax;
            var cgst = 0.00;
            var sgst = 0.00;
            var igst = 0.00;
            if (result === companyState) {
                cgst = total_taxamount / 2;
                sgst = total_taxamount / 2;
            } else {
                igst = tax;
            }
            document.getElementById("cgst").value = cgst.toFixed(2);
            document.getElementById("sgst").value = sgst.toFixed(2);
            document.getElementById("igst").value = igst.toFixed(2);
            if (result === companyState) {
                document.getElementById("tr_igst").style.display = "none";
                document.getElementById("tr_cgst").style.display = "";
                document.getElementById("tr_sgst").style.display = "";
            } else {
                document.getElementById("tr_igst").style.display = "";
                document.getElementById("tr_cgst").style.display = "none";
                document.getElementById("tr_sgst").style.display = "none";
            }
            document.getElementById("total_taxamount").value = total_taxamount.toFixed(2);
            var grandtotal = subtotal + total_taxamount + shipping + adjust;
            // Calculate and display the difference
            balance = grandtotal - advance
            document.getElementById("grandtotal").value = grandtotal.toFixed(2);
            document.getElementById("balance").value = balance.toFixed(2);

            const number = extractNumber(data1);
            const number2 = extractNumber(data2);
            console.log(number, "number one");
            console.log(number2, "number two");

            const selectElement = document.getElementById(`tax${id}`);
            const gstOptgroup = selectElement.querySelector('.gstlabel');
            const igstOptgroup = selectElement.querySelector('.igstlabel');




            if (data3 === 'Kerala') {
                gstOptgroup.style.display = 'inline'; // Hide IGST optgroup
                igstOptgroup.style.display = 'hidden'; // Display GST optgroup
                console.log(data3, "data3");
                const select = document.getElementById(`tax${id}`).children[0].children;
                console.log(select, "select for GST");

                for (let i = 0; i < select.length; i++) {
                    if (select[i].value === number) {
                        document.getElementById(`tax${id}`).selectedIndex = i;
                        console.log(i, "selected index for GST");
                        const selectedLabel = select[i].parentNode.label; // Retrieve the label of the parent optgroup
                        console.log(selectedLabel, "label for GST");
                        break;
                    }
                }
            } else {

                gstOptgroup.style.display = 'hidden'; // hide GST optgroup
                igstOptgroup.style.display = 'inline'; // Display IGST optgroup
                console.log(data3, "else");
                const select = document.getElementById(`tax${id}`).children[1].children;
                console.log(select, "select for IGST");

                for (let i = 0; i < select.length; i++) {
                    if (select[i].value === number2) {
                        console.log(select[i], "selected option for GST");
                        console.log(number2, "number2");
                        document.getElementById(`tax${id}`).selectedIndex = i;
                        console.log(i, "selected index for IGST");
                        const selectedLabel = select[i].parentNode.label; // Retrieve the label of the parent optgroup
                        console.log(selectedLabel, "label for IGST");
                        break;
                    }
                }
            }



        }
    });


}










if (data3 === 'Kerala') {
    gstOptgroup.style.display = 'inline'; // Hide IGST optgroup
    igstOptgroup.style.display = 'hidden'; // Display GST optgroup
    console.log(data3, "data3");
    const select = document.getElementById(`tax${id}`).children[0].children;
    console.log(select, "select for GST");

    for (let i = 0; i < select.length; i++) {
        if (select[i].value === number) {
            document.getElementById(`tax${id}`).selectedIndex = i;
            console.log(i, "selected index for GST");
            const selectedLabel = select[i].parentNode.label; // Retrieve the label of the parent optgroup
            console.log(selectedLabel, "label for GST");
            break;
        }
    }
} else {

    gstOptgroup.style.display = 'hidden'; // hide GST optgroup
    igstOptgroup.style.display = 'inline'; // Display IGST optgroup
    console.log(data3, "else");
    const select = document.getElementById(`tax${id}`).children[1].children;
    console.log(select, "select for IGST");

    for (let i = 0; i < select.length; i++) {
        if (select[i].value === number2) {
            console.log(select[i], "selected option for GST");
            console.log(number2, "number2");
            document.getElementById(`tax${id}`).selectedIndex = i;
            console.log(i, "selected index for IGST");
            const selectedLabel = select[i].parentNode.label; // Retrieve the label of the parent optgroup
            console.log(selectedLabel, "label for IGST");
            break;
        }
    }
}
