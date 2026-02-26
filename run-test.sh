#!/bin/bash

BASE_WRAPPER_DIR="/home/anant/Documents/Wrappers/wrapper-implementation"
FRAMEWORK_DIR="/home/anant/Documents/SDK-Automation-Framework"

echo "------------------------------------------"
echo "   SDK INTEGRATION TEST RUNNER"
echo "------------------------------------------"
echo "Which SDK would you like to test?"
echo "1) Go-SDK" 
echo "2) C-Sharp_SDK" 
echo "3) PHP_SDK" 
echo "4) PYTHON_SDK"
echo "5) Node_SDK" 
echo "6) Ruby_SDK"  
echo "7) JAVA_SDK" 
echo "8) Dotnet_SDK"
echo "9) Run ALL"
echo "0) Exit"
echo "------------------------------------------"
read -p "Enter your choice [0-9]: " choice

case $choice in
    1)
        echo "🚀 Starting Go-SDK tests..."
        # 1. Kill anything on port 4000
        sudo fuser -k 4000/tcp 2>/dev/null
        
        # 2. Start the Go server (Assuming your Go main file is in the Go_wrapper folder)
        # Adjust the path below if your Go project folder is named differently
        cd $BASE_WRAPPER_DIR/Golang_wrapper_integration-test/API_Integration && go run main.go > /dev/null 2>&1 &
        
        # 3. Wait for Go to compile and start
        echo "⏳ Waiting 5 seconds for Go server..."
        sleep 5
        
        # 4. Run the test
        cd "$FRAMEWORK_DIR" && npx playwright test --project=Go-SDK
        
        # 5. Cleanup
        sudo fuser -k 4000/tcp 2>/dev/null
        ;;
    2)
        echo "🚀 Starting Csharp-SDK tests..."
        sudo fuser -k 3000/tcp 2>/dev/null
        
        # Navigate to the ACTUAL project folder
        cd "$BASE_WRAPPER_DIR/Csharp_wrapper_integration_test/Integration_test" && dotnet run > /dev/null 2>&1 &
        # We send 'parsewebhook' to satisfy the C# switch statement
        echo "parsewebhook" | dotnet run --urls="http://127.0.0.1:3000" > dotnet_log.txt 2>&1 &
        
        echo "⏳ Waiting for .NET server to listen on port 3000..."
        # Loop to check if port 3000 is open
        for i in {1..30}; do
          if nc -z 127.0.0.1 3000; then
            echo "✅ Server is UP!"
            break
          fi
          if [ $i -eq 30 ]; then
            echo "❌ ERROR: Server failed to start. Check dotnet_log.txt"
            cat dotnet_log.txt
            exit 1
          fi
          sleep 1
        done
        cd "$FRAMEWORK_DIR"
        npx playwright test --project=C-sharp_SDK

        sudo fuser -k 3000/tcp 2>/dev/null
        ;; 
    3)
        echo "🚀 Starting PHP_SDK tests..."
        sudo fuser -k 8001/tcp 2>/dev/null
        cd "$BASE_WRAPPER_DIR/php_wrapper_integration_test" && php -S 127.0.0.1:8001 > /dev/null 2>&1 &
        echo "⏳ Waiting 3s for PHP..."
        sleep 3
        cd "$FRAMEWORK_DIR" && npx playwright test --project=PHP_SDK
        sudo fuser -k 8001/tcp 2>/dev/null
        ;;
    4)
        echo "🚀 Starting PYTHON_SDK tests..."
        sudo fuser -k 5000/tcp 2>/dev/null
        cd "$BASE_WRAPPER_DIR/Python_wrapper_integration_test" && python3 app.py > /dev/null 2>&1 &
        echo "⏳ Waiting 5s for Python..."
        sleep 5
        cd "$FRAMEWORK_DIR" && npx playwright test --project=PYTHON_SDK
        sudo fuser -k 5000/tcp 2>/dev/null
        ;;
    5)
        echo "🚀 Starting Node_SDK tests..."
        sudo fuser -k 3001/tcp 2>/dev/null
        cd "$BASE_WRAPPER_DIR/Node.js_wrapper_integration-test" && npm start > /dev/null 2>&1 &
        echo "⏳ Waiting 5s for Node.js..."
        sleep 5
        cd "$FRAMEWORK_DIR" && npx playwright test --project=Node_SDK
        sudo fuser -k 3001/tcp 2>/dev/null
        ;;
    6)
        echo "🚀 Starting Ruby_SDK tests..."
        sudo fuser -k 4567/tcp 2>/dev/null
        cd "$BASE_WRAPPER_DIR/ruby_wrapper_integration_test" && ruby app.rb > /dev/null 2>&1 &
        echo "⏳ Waiting 5s for Ruby..."
        sleep 5
        cd "$FRAMEWORK_DIR" && npx playwright test --project=Ruby_SDK
        sudo fuser -k 4567/tcp 2>/dev/null
        ;;
    7)
        echo "🚀 Starting JAVA_SDK tests..."
        # 1. Kill any zombie processes on port 8000
        sudo fuser -k 8000/tcp 2>/dev/null
        
        # 2. Start the server in the background
        cd $BASE_WRAPPER_DIR/Java_wrapper_integration_test && ./mvnw spring-boot:run > /dev/null 2>&1 &
        
        # 3. Wait for it to initialize
        echo "⏳ Waiting 15 seconds for Spring Boot to initialize..."
        sleep 15
        
        # 4. Run the test
        cd "$FRAMEWORK_DIR" && npx playwright test --project=JAVA_SDK
        
        # 5. Optional: Kill the server after the test is done
        sudo fuser -k 8000/tcp 2>/dev/null
        ;;
    8)
        echo "🚀 Starting Dotnet_SDK tests..."
        sudo fuser -k 5000/tcp 2>/dev/null
        cd "$BASE_WRAPPER_DIR/Dotnet-core_wrapper_integration_test" && dotnet run --urls="http://127.0.0.1:5000" > /dev/null 2>&1 &
        echo "⏳ Waiting 15s for .NET..."
        sleep 15
        cd "$FRAMEWORK_DIR" && npx playwright test --project=Dotnet_SDK
        sudo fuser -k 5000/tcp 2>/dev/null
        ;;
    9)
        echo "🔥 Running ALL SDK tests one by one..."
        npx playwright test
        ;;
    0)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        ;;
esac