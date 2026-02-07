import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}
export async function POST(req) {
    const data = await req.json();
    const username = data.username;
    const email = data.email;
    const password = data.password;
    const firstname = data.firstname;
    const lastname = data.lastname;
    if (!username || !email || !password) {
        return NextResponse.json({
            message: "Missing mandatory data"
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
    try {
        const client = await getClientPromise();
        const db = client.db("wod-01");
        const result = await db.collection("user").insertOne({
            username: username,
            email: email,
            password: await bcrypt.hash(password, 10),
            firstname: firstname,
            lastname: lastname,
            status: "ACTIVE"
        });
        console.log("result", result);
        return NextResponse.json({
            id: result.insertedId
        }, {
            status: 200,
            headers: corsHeaders
        });
    }
    catch (exception) {
        console.log("exception", exception.toString());
        const errorMsg = exception.toString();
        let displayErrorMsg = "";
        if (errorMsg.includes("duplicate")) {
            if (errorMsg.includes("username")) {
                displayErrorMsg = "Duplicate Username!!"
            }
            else if (errorMsg.includes("email")) {
                displayErrorMsg = "Duplicate Email!!"
            }
        }
        return NextResponse.json({
            message: displayErrorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}

export async function GET(req) {
    try {
        const client = await getClientPromise();
        const db = client.db("wod-01");
        const users = await db.collection("user").find({}, {
            projection: { password: 0 }
        }).toArray();

        return NextResponse.json(users, {
            headers: corsHeaders,
        });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const data = await req.json();
        const { _id, firstname, lastname, email } = data;
        const client = await getClientPromise();
        const db = client.db("wod-01");

        await db.collection("user").updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    firstname,
                    lastname,
                    email
                }
            }
        );

        return NextResponse.json({ message: "Updated" }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500, headers: corsHeaders });
    }
}


export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const client = await getClientPromise();
        const db = client.db("wod-01");

        await db.collection("user").deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: "Deleted" }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500, headers: corsHeaders });
    }
}