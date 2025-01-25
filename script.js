
const submit_url =
    "https://script.google.com/macros/s/AKfycbwMVFZNwhuCXAHf_jz1o5gtxHWDfUYc2-RfJFYH_EkHw7Z_e2qz46aIJmEo1yz-2HUh/exec";

$(document).ready(function () {

    var defArr = [];
    defArr.push($.get('./home.html'));
    defArr.push($.get('./calculator.html'));
    $.when.apply($, defArr).done(function (response1, response2) {
        $('#myTabContent').html(response1[2].responseText + response2[2].responseText);
        webPageLoaded();
    });



});

function webPageLoaded(){
    
    loadDefauts();
    let product_type = $(".product_type");
    let epoxy_type = $("#epoxy_type");
    product_type.click(function () {
        $(this).parent().parent().find(".round").toggle();
        $(this).parent().parent().find(".square").toggle();
    });

    epoxy_type.change(function () {
        let val = $(this).val();
        if (val == "square") {
            $("#round_div").hide();
            $("#square_div").show();
        } else {
            $("#round_div").show();
            $("#square_div").hide();
        }
    });

    $("#delivery_date").datepicker({
        maxDate: "+1M",
        minDate: "+4D",
    });

    $("#Calculate").click(function () {
        calculateEpoxyResign();
    });

    $("#profile-tab").click(function () {
        $("#e_length").focus();
    });

    $("#add_item").click(function () {
        addItem();
    });

    $(".calculate_price").click(function () {
        O_calculatePrice($(this));
    });
    const form = document.getElementById("create_orders_form");
    const calculator_form = document.getElementById("calculator_form");
    const calculator_form_2 = document.getElementById("calculator_form_2");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        loading();
        const form_obj = new FormData(form);
        let product_type =
            $("#product_type").is("checked") ? "Square" : "Round";
        form_obj.append("product_type", product_type);
        let items_json = getAllItemsAsJson();
        form_obj.append("items_json", items_json);
        fetch(submit_url, {
            redirect: "follow",
            method: "POST",
            body: form_obj,
        }).then(() => {
            console.log("Form Created Successfully");
            location.reload();
        });
    });

    calculator_form.addEventListener("submit", function (e) {
        e.preventDefault();
        calculateEpoxyResign();
    });

    calculator_form_2.addEventListener("submit", function (e) {
        e.preventDefault();
        calculatePrice();
    });
}

function O_calculatePrice(ths) {
    let e_length = $("#e_length");
    let e_width = $("#e_width");
    let e_coating = $("#e_coating");
    let e_diameter = $("#e_Diameter");
    let isSquare = ths.parent().parent().find(".product_type").is(":checked");
    if (isSquare) {
        $("#epoxy_type").val("square");
    } else {
        $("#epoxy_type").val("round");
    }
    $("#epoxy_type").change();
    let length = ths.parent().parent().find(".i_length").val();
    let width = ths.parent().parent().find(".i_height").val();
    let coating = ths.parent().parent().find(".i_Coating").val();
    let diameter = ths.parent().parent().find(".i_diameter").val();
    e_length.val(length);
    e_width.val(width);
    e_coating.val(coating);
    e_diameter.val(diameter);
    $("#profile-tab").click();
    calculatePrice();
}

function addItem() {
    let lastItem = $(".accordion-item").last();
    let newItem = lastItem.clone(true);
    newItem.find("input, textarea").each(function () {
        $(this).val("");
    });
    let itemNumber = parseInt(newItem.find(".item-number").text());
    newItem.find("#item" + itemNumber).attr("id", "item" + (itemNumber + 1));
    newItem
        .find(".accordion-button")
        .attr("data-bs-target", "#item" + (itemNumber + 1));
    newItem.find(".item-number").text(itemNumber + 1);
    $(".accordion").append(newItem);
}


function getAllItemsAsJson() {
    let items = [];
    $(".accordion-item").each(function () {
        let item = {
            length: $(this).find(".i_length").val(),
            width: $(this).find(".i_height").val(),
            coating: $(this).find(".i_Coating").val(),
            diameter: $(this).find(".i_diameter").val(),
            customizations: $(this).find(".Customizations").val(),
        };
        items.push(item);
    });
    return JSON.stringify(items);
}


function calculatePrice() {
    calculateEpoxyResign();
    let price = 0;
    let epoxy_liters = $("#e_liters").val();
    let liter_price = $("#liter_price").val();
    price = epoxy_liters * liter_price;
    $("#price").val(price);
}

function calculateEpoxyResign() {
    let epoxy_type = $("#epoxy_type").val();
    let diameter = $("#e_Diameter").val();
    let length = $("#e_length").val();
    let width = $("#e_width").val();
    let coating = $("#e_coating").val();
    let epoxy_liters = 0;
    if (epoxy_type == "square") {
        epoxy_liters = (length * width * coating) / 62;
    } else {
        epoxy_liters = (3.14 * (diameter / 2) * (diameter / 2) * coating) / 62;
    }
    $("#e_liters").val(epoxy_liters);
}

function loadDefauts() {
    document.getElementById("create_orders_form").reset();
    $(".square, .loading, #round_div").hide();
    $(".round,.loaded").show();
    $("#submit_btn").removeAttr("disabled");
    $("#Name").focus();
}

function loading() {
    $("#submit_btn").attr("disabled", true);
    $(".loading").show();
    $(".loaded").hide();
}
