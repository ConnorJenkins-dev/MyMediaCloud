package com.example.mycloud

import com.example.mycloud.ui.theme.AccountInterface
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
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

    companion object
}
