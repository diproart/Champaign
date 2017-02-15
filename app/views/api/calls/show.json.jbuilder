json.set! :call do
  json.extract!(@call, :id)
  json.status CallTool::CallStatus.for(@call)
end
