package com.example.mycloud

import com.example.mycloud.ui.theme.AccountInterface
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

open class APICall {

    suspend fun scan(accountInterface : AccountInterface): Int {
        var code = 0
        val account = accountInterface.getAccount()
        val URL = account[0].url
        val user = account[0].username
        val pass = account[0].password

        val urlconcat = URL("$URL$user-$pass/scan")

        val conn = urlconcat.openConnection() as HttpURLConnection
        try {
            conn.connect()
            if(conn.responseCode == 200){
                code = 200
            } else if (conn.responseCode == 401) {
                code = 401
            } else {
                code = 1
            }
        } catch (e : Exception) {
            System.err.println(e)
        } finally {
            conn.disconnect()
        }
        return code
    }

    suspend fun getMedia(accountInterface: AccountInterface, month: Int, year: Int) : JSONArray? {
        var b64Img = ArrayList<String>()
        val account = accountInterface.getAccount()
        val URL = account[0].url
        val user = account[0].username
        val pass = account[0].password

        val urlconcat = URL("$URL$user-$pass/images/$month-$year")
        val conn = urlconcat.openConnection() as HttpURLConnection

        var json: JSONArray? = null

        try {
            conn.connect()
            if(conn.responseCode == 200){
                val body = conn.inputStream.bufferedReader().use { it.readText() }
                println(body)
                json = JSONArray(body)
            } else if (conn.responseCode == 401) {
                println("401")
            } else {
                println("Getmedia brokie")
            }
        } catch (e : Exception) {
            System.err.println(e)
        } finally {
            conn.disconnect()
        }

        return json
    }

    companion object
}
