VOICE ANNOUNCEMENTS
-------------------
Out of the box the game uses the phone's built-in speech engine (synthetic speech, NOT a human recording).
To use real recordings:
 1. Record or license natural voice lines and save them in this folder as .mp3 files named:
    welcome start nice great awesome sweet fantastic supercombo incredible excellent fire complete three
    m_sweet m_great m_excellent m_combo m_amazing m_fantastic m_unbelievable m_record   (these read the on-screen messages)
    try1 try2 daily power choice world achv
    (e.g. welcome.mp3 = "Welcome to MG Candy Blast!")
 2. In audio.js change  const VOICE_FILE_EXT='';  to  const VOICE_FILE_EXT='.mp3';
 3. Add the .mp3 files to FILES in service-worker.js so they work offline.
If a file is missing or fails to play, the game falls back to the speech engine automatically.
