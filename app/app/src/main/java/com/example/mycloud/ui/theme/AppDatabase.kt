package com.example.mycloud.ui.theme

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [Account::class], version = 1)
abstract class AccountDatabase : RoomDatabase(){
    abstract fun AccountInterface(): AccountInterface
}