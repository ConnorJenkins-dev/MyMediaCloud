package com.example.mycloud

import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
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
import com.example.mycloud.ui.theme.AccountInterface
import kotlin.concurrent.thread
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

import com.example.mycloud.APICall
import kotlinx.coroutines.withContext
import kotlin.io.encoding.Base64

class MainActivity : ComponentActivity() {

    private lateinit var settings : Button

    private lateinit var imageview : ImageView

    private lateinit var accountInterface : AccountInterface

    var dbReady = false


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("MainActivity", "onCreate called")
        setContentView(R.layout.activity_main)
        settings = findViewById(R.id.settings)
        imageview = findViewById(R.id.imageView2)
        initDB()

        // Call scan
        // Get Latest

        settings.setOnClickListener() {
            val intent = Intent(this, Settings_Activity::class.java)
            startActivity(intent)
        }

        when(dbReady){
            true ->

            CoroutineScope(Dispatchers.IO).launch {
                val code = APICall().getMedia(accountInterface, 1, 2023)
                println(code)
            }

            false -> null
        }
    }

    private fun initDB(): Thread {
        return thread {
            val db = Room.databaseBuilder(
                applicationContext,
                AccountDatabase::class.java,
                "ACCOUNT_DATABASE"
            ).build()

            accountInterface = db.AccountInterface()

            if(accountInterface.countAccounts() != 1) {
                val intent = Intent(this, Settings_Activity::class.java)
                startActivity(intent)
            } else {
                // set bool that DB accountInterface is ready
                dbReady = true

                // Call Scan!
                CoroutineScope(Dispatchers.IO).launch {
                    val code = APICall().scan(accountInterface)
                    System.out.println("CODE: $code")
                }

                // Debug, get some base64 (test)

                CoroutineScope(Dispatchers.IO).launch {
                    val code = APICall().getMedia(accountInterface, 1, 2023)
                    println(code?.length())
                    
                    val first = code?.getJSONObject(0)
                    val first64 : String? = first?.getString("base64")

                    if(first64.isNullOrEmpty()) {
                        return@launch
                    }
                    val imageBytes = Base64.decode(first64, 0, first64.length)

                    val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)

                    withContext(Dispatchers.Main) {
                        imageview.setImageBitmap(bitmap)
                    }
                }
            }
        }
    }
}
