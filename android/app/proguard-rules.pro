# ProGuard / R8 rules for Full Stack Academy Trusted Web Activity (TWA)
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Keep Android Browser Helper & Custom Tabs classes
-keep class com.google.androidbrowserhelper.** { *; }
-keep class androidx.browser.** { *; }

# Prevent stripping of manifest placeholder resources
-keepclassmembers class **.R$* {
    public static <fields>;
}
