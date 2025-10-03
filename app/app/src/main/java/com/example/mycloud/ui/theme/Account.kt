package com.example.mycloud.ui.theme

import androidx.room.ColumnInfo
import androidx.room.Dao
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.PrimaryKey
import androidx.room.Query

@Entity
data class Account(
    @PrimaryKey(autoGenerate = true) val uid: Int,
    @ColumnInfo(name = "username") val username: String,
    @ColumnInfo(name = "password") val password: String,
    @ColumnInfo(name = "url") val url: String
)


@Dao
interface AccountInterface{
    @Query("SELECT * FROM account")
    fun getAccount(): List<Account>

    @Query("SELECT COUNT(*) FROM account")
    fun countAccounts(): Int

    @Query("DELETE FROM account")
    fun delAll()

    @Insert
    fun insertAccount(vararg account: Account)
}