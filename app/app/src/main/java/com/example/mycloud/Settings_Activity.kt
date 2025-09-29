package com.example.mycloud

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import com.example.mycloud.databinding.SettingsActivityBinding
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class Settings_Activity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: SettingsActivityBinding


    // Get users details, server username, password and URL:
    private lateinit var username : EditText
    private lateinit var password : EditText
    private lateinit var url : EditText

    private lateinit var testURL : Button

    private lateinit var code : TextView

    private lateinit var response : TextView


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        //binding = SettingsActivityBinding.inflate(layoutInflater)
        setContentView(R.layout.settings_activity)

        username = findViewById(R.id.uname_input)
        password = findViewById(R.id.password_input)
        url = findViewById(R.id.serve_input)

        testURL = findViewById(R.id.test)

        code = findViewById(R.id.codeResp)
        response = findViewById(R.id.conn)

        // using test params, server running on localhost for testing.
        testURL.setOnClickListener() {
            connectionTest("http://10.0.2.2:3000/api/", "conno", "password")
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_settings)
        return navController.navigateUp(appBarConfiguration)
                || super.onSupportNavigateUp()
    }

        // Basic fetch function, uses separate thread from main
    private fun connectionTest(url :String, user :String, pass :String): Thread {
        updateUI("000", "waiting...")
        return thread {
            val url = URL("$url$user-$pass")
            val conn = url.openConnection() as HttpURLConnection
            try {
                conn.connect()
                if(conn.responseCode == 200){
                    updateUI("200", "Connection successful!")
                } else if (conn.responseCode == 401) {
                    updateUI("401", "Connection successful, authentication failed...")
                } else {
                    updateUI("null", "Failed")
                }
            } catch (e : Exception) {
                System.err.println(e)
            } finally {
                conn.disconnect()
            }
        }
    }

    // Basic view updating function, switches to UI thread.
    private fun updateUI(coderesp :String, msg :String){
        runOnUiThread {
            code.text = coderesp
            response.text = msg
        }
    }
}