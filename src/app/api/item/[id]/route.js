import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}
export async function GET(req, { params }) {

    const { id } = await params;
    try {
        const client = await getClientPromise();
        const db = client.db("wod-01");
        const result = await db.collection("item").findOne({ _id: new ObjectId(id) });
        console.log("==> result", result);
        return NextResponse.json(result, {
            headers: corsHeaders
        });
    }
    catch (exception) {
        console.log("exception", exception.toString());
        const errorMsg = exception.toString();
        return NextResponse.json({
            message: errorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}
export async function PATCH(req, { params }) {
    const { id } = await params;
    const data = await req.json(); //assume that it contain part of data...
    const partialUpdate = {};
    console.log("data : ", data);
    if (data.name != null) partialUpdate.itemName = data.name;
    if (data.category != null) partialUpdate.itemCategory = data.category;
    if (data.price != null) partialUpdate.itemPrice = data.price;
    try {
        const client = await getClientPromise();
        const db = client.db("wod-01");
        const existedData = await db.collection("item").findOne({
            _id: new
                ObjectId(id)
        });
        const updateData = { ...existedData, ...partialUpdate };
        const updatedResult = await db.collection("item").updateOne({
            _id: new
                ObjectId(id)
        }, { $set: updateData });
        return NextResponse.json(updatedResult, {
            status: 200,
            headers: corsHeaders
        })
    }
    catch (exception) {
        const errorMsg = exception.toString();
        return NextResponse.json({
            message: errorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}
export async function PUT(req, { params }) {
    const { id } = await params;
    const data = await req.json(); //assume that it contain whole item data...
    try {
        const client = await getClientPromise();
        const db = client.db("wod-01");
        const updatedResult = await db.collection("item").updateOne({
            _id: new
                ObjectId(id)
        }, { $set: data });
        return NextResponse.json(updatedResult, {
            status: 200,
            headers: corsHeaders
        })
    }
    catch (exception) {
        console.log("exception", exception.toString());
        const errorMsg = exception.toString();
        return NextResponse.json({
            message: errorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        const client = await getClientPromise();
        const db = client.db("wod-01");
        const result = await db.collection("item").deleteOne({
            _id: new ObjectId(id)
        });

        return NextResponse.json(result, {
            status: 200,
            headers: corsHeaders
        })
    }
    catch (exception) {
        console.log("exception", exception.toString());
        const errorMsg = exception.toString();
        return NextResponse.json({
            message: errorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}