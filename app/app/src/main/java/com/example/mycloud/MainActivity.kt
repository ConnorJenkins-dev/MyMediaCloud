package com.example.mycloud

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.mycloud.ui.theme.MyCloudTheme
import androidx.room.Room
import com.example.mycloud.ui.theme.AccountDatabase
import kotlin.concurrent.thread

class MainActivity : ComponentActivity() {

    private lateinit var settings : Button


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("MainActivity", "onCreate called")
        setContentView(R.layout.activity_main)
        settings = findViewById(R.id.settings)
        initDB()

        // Call scan
        // Get Latest

        settings.setOnClickListener() {
            val intent = Intent(this, Settings_Activity::class.java)
            startActivity(intent)
        }
    }

    private fun initDB(): Thread {
        return thread {
            val db = Room.databaseBuilder(
                applicationContext,
                AccountDatabase::class.java,
                "ACCOUNT_DATABASE"
            ).build()

            val accountInterface = db.AccountInterface()

            if(accountInterface.countAccounts() != 1) {
                val intent = Intent(this, Settings_Activity::class.java)
                startActivity(intent)
            } else {
                // Call Scan!
            }
        }
    }
}
