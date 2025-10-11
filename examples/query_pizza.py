import rdflib

# 1. Create a graph
g = rdflib.Graph()

# 2. Parse the ontology schema and instance data into the graph
# This merges both files into a single data model
g.parse("ontology/pizza_ontology.ttl", format="turtle")
g.parse("data/pizza_instances.ttl", format="turtle")

# 3. Define the SPARQL query
# "페퍼로니 피자를 조리하는 직원의 이름과, 그 피자를 굽는 오븐의 현재 온도를 찾아라"
query = """
    PREFIX : <http://example.org/pizza-ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?employeeName ?temp
    WHERE {
      ?pizza a :Pizza ;
             :recipeName "페퍼로니 피자" ;
             :isCookedBy ?employee ;
             :isBakedIn ?oven .

      ?employee :employeeName ?employeeName .
      ?oven :currentTemp ?temp .
    }
"""

# 4. Execute the query and print the results
print("--- SPARQL 쿼리 실행 결과 ---")
print("질의: 페퍼로니 피자를 조리하는 직원과 오븐 온도는?")
for row in g.query(query):
    print(f"  - 직원: {row.employeeName}, 오븐 온도: {row.temp}°C")

print("\n--- 쿼리 설명 ---")
print("위 쿼리는 온톨로지에 정의된 관계(isCookedBy, isBakedIn)를 따라 여러 객체(피자, 직원, 오븐)에 걸쳐있는 정보를 한번에 찾아냅니다.")
print("이것이 바로 데이터가 '연결'되어 있을 때의 강점입니다.")
